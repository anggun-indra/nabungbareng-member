/**
 * Client-Side Image Compressor untuk Bukti Transfer NabungBareng
 *
 * Spesifikasi README.md:
 * - Output: JPEG
 * - Sisi terpanjang: Maksimal 1.920 px (Fallback: 1.600 px)
 * - Kualitas awal: 0,82 (Fallback: 0,65)
 * - Target ukuran: <= 600 KB (Batas bucket Supabase: 750 KB)
 * - Metadata: Hash SHA-256 menggunakan Web Crypto API
 * - Mengutamakan ketajaman teks/angka (OCR Gemini & audit manusia) dengan ukuran sekecil mungkin
 */

export interface CompressionOptions {
  maxDimension?: number
  fallbackDimension?: number
  initialQuality?: number
  fallbackQuality?: number
  targetSizeKb?: number
  maxSizeKb?: number
}

export interface CompressionResult {
  file: File
  blob: Blob
  previewUrl: string
  originalSize: number
  compressedSize: number
  compressionRatio: number // 0 to 1, e.g. 0.82 means 82% smaller
  width: number
  height: number
  sha256: string
  formattedOriginalSize: string
  formattedCompressedSize: string
  qualityUsed: number
  isUnderLimit: boolean
}

/**
 * Format bytes to readable string (e.g. 340 KB, 2.4 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Compute SHA-256 hash using browser Web Crypto API
 */
export async function computeSHA256(
  blobOrBuffer: Blob | ArrayBuffer,
): Promise<string> {
  const buffer =
    blobOrBuffer instanceof Blob
      ? await blobOrBuffer.arrayBuffer()
      : blobOrBuffer

  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  // Fallback if Web Crypto is unavailable
  return "sha256-unavailable"
}

/**
 * Load image file into an HTMLImageElement
 */
function loadImage(fileOrBlob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(fileOrBlob)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }

    img.onerror = (err) => {
      URL.revokeObjectURL(url)
      reject(new Error("Gagal memuat gambar. Pastikan format gambar valid."))
    }

    img.src = url
  })
}

/**
 * Calculate scaled dimensions while preserving aspect ratio
 */
function calculateDimensions(
  origW: number,
  origH: number,
  maxDim: number,
): { width: number; height: number } {
  let width = origW
  let height = origH

  if (width > maxDim || height > maxDim) {
    if (width > height) {
      height = Math.round((height * maxDim) / width)
      width = maxDim
    } else {
      width = Math.round((width * maxDim) / height)
      height = maxDim
    }
  }

  return { width, height }
}

/**
 * Render image to Canvas and export as JPEG Blob
 */
function renderToJpegBlob(
  img: HTMLImageElement,
  targetW: number,
  targetH: number,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    canvas.width = targetW
    canvas.height = targetH

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      reject(new Error("Canvas 2D Context tidak didukung pada browser ini."))
      return
    }

    // Fill canvas with white background (prevents transparent PNG becoming black in JPEG)
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, targetW, targetH)

    // High quality smoothing for clear crisp typography and digits
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    ctx.drawImage(img, 0, 0, targetW, targetH)

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error("Gagal mengekspor canvas ke Blob JPEG."))
        }
      },
      "image/jpeg",
      quality,
    )
  })
}

/**
 * Main Client-side Image Compression function
 * Follows README.md multi-stage optimization:
 * 1. 1920px @ 0.82 (Target <= 600 KB)
 * 2. 1920px @ 0.75 (Fallback stage 1)
 * 3. 1600px @ 0.65 (Fallback stage 2)
 * 4. 1400px @ 0.60 (Extreme fallback if original was huge/noisy)
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {},
): Promise<CompressionResult> {
  const {
    maxDimension = 1920,
    fallbackDimension = 1600,
    initialQuality = 0.82,
    fallbackQuality = 0.65,
    targetSizeKb = 600,
    maxSizeKb = 750,
  } = options

  // Validate MIME type
  if (!file.type.startsWith("image/")) {
    throw new Error(
      "Format file tidak didukung. Mohon unggah file gambar (JPG, PNG, WebP).",
    )
  }

  const originalSize = file.size
  const img = await loadImage(file)
  const origW = img.naturalWidth || img.width
  const origH = img.naturalHeight || img.height

  // Optimization steps configuration
  const steps = [
    // Step 1: Default spec - 1920px @ 0.82
    { maxDim: maxDimension, quality: initialQuality },
    // Step 2: 1920px @ 0.75
    { maxDim: maxDimension, quality: 0.75 },
    // Step 3: Fallback spec - 1600px @ 0.65
    { maxDim: fallbackDimension, quality: fallbackQuality },
    // Step 4: Guardrail - 1400px @ 0.60
    { maxDim: 1400, quality: 0.6 },
  ]

  let bestBlob: Blob | null = null
  let bestQuality = initialQuality
  let bestDim = { width: origW, height: origH }

  const targetBytes = targetSizeKb * 1024
  const maxBytes = maxSizeKb * 1024

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    const dim = calculateDimensions(origW, origH, step.maxDim)
    const blob = await renderToJpegBlob(
      img,
      dim.width,
      dim.height,
      step.quality,
    )

    bestBlob = blob
    bestQuality = step.quality
    bestDim = dim

    // If result meets the target size, accept immediately
    if (blob.size <= targetBytes) {
      break
    }
  }

  if (!bestBlob) {
    throw new Error("Proses kompresi gambar gagal menghasilkan output.")
  }

  // Create clean safe filename with .jpg extension
  const baseName = file.name.replace(/\.[^/.]+$/, "") || "bukti_transfer"
  const cleanFileName = `${baseName}.jpg`

  const compressedFile = new File([bestBlob], cleanFileName, {
    type: "image/jpeg",
    lastModified: Date.now(),
  })

  // Compute cryptographic SHA-256 for audit and backend verification
  const sha256 = await computeSHA256(bestBlob)

  // Object URL for crisp instant UI preview
  const previewUrl = URL.createObjectURL(bestBlob)

  const compressedSize = bestBlob.size
  const ratio = Math.max(0, 1 - compressedSize / originalSize)

  return {
    file: compressedFile,
    blob: bestBlob,
    previewUrl,
    originalSize,
    compressedSize,
    compressionRatio: ratio,
    width: bestDim.width,
    height: bestDim.height,
    sha256,
    formattedOriginalSize: formatBytes(originalSize),
    formattedCompressedSize: formatBytes(compressedSize),
    qualityUsed: bestQuality,
    isUnderLimit: compressedSize <= maxBytes,
  }
}
