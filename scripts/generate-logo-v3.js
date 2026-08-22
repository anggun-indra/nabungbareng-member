import sharp from "sharp"
import fs from "node:fs"
import path from "node:path"

const artifactDir =
  "/Users/nb-mac-fj2n0x/.gemini/antigravity/brain/3c79ec51-9a3e-439b-9cfe-cf814fc4b2b1"

/**
 * PERFECT HANDSHAKE COMPONENT
 * Pure white `#FFFFFF` silhouette with clean `#2B7FFF` cut/line separators.
 * Centered around (cx, cy)
 */
function createHandshake(
  cx = 256,
  cy = 290,
  scale = 1.0,
  strokeColor = "#2B7FFF",
) {
  return `
  <g id="handshake-core" transform="translate(${cx}, ${cy}) scale(${scale})">
    <!-- Left Sleeve (Angle 32 deg) -->
    <path d="
      M -115 -25 
      L -80 -48 
      C -76 -51, -70 -50, -67 -46 
      L -52 -22 
      C -49 -18, -50 -12, -54 -9 
      L -89 14 
      C -93 17, -99 16, -102 12 
      L -117 -12 
      C -120 -16, -119 -22, -115 -25 Z
    " fill="#FFFFFF"/>
    
    <!-- Right Sleeve (Angle -32 deg) -->
    <path d="
      M 115 -25 
      L 80 -48 
      C 76 -51, 70 -50, 67 -46 
      L 52 -22 
      C 49 -18, 50 -12, 54 -9 
      L 89 14 
      C 93 17, 99 16, 102 12 
      L 117 -12 
      C 120 -16, 119 -22, 115 -25 Z
    " fill="#FFFFFF"/>

    <!-- Left Hand Palm & Thumb crossing over top -->
    <path d="
      M -68 -16
      L -32 -40
      C -20 -48, -4 -44, 4 -32
      C 12 -20, 28 -18, 44 -22
      C 52 -24, 60 -18, 62 -10
      C 64 -2, 58 6, 50 8
      L 24 14
      C 10 18, -4 12, -14 2
      L -36 24
      C -44 32, -56 34, -66 28
      L -76 18
      Z
    " fill="#FFFFFF"/>

    <!-- Right Hand Palm & Fingers gripping under -->
    <path d="
      M 68 -16
      L 32 -40
      C 20 -48, 4 -44, -4 -32
      L -18 -18
      C -26 -10, -28 2, -20 10
      L 14 44
      C 22 52, 34 56, 46 52
      L 64 42
      C 72 34, 76 24, 74 14
      Z
    " fill="#FFFFFF"/>

    <!-- 4 Interlocking Fingers of Right Hand -->
    <!-- Finger 1 -->
    <path d="
      M -6 -8
      L -30 16
      C -36 22, -36 32, -30 38
      C -24 44, -14 44, -8 38
      L 16 14
      C 22 8, 22 -2, 16 -8
      C 10 -14, 0 -14, -6 -8 Z
    " fill="#FFFFFF"/>

    <!-- Finger 2 -->
    <path d="
      M 8 6
      L -16 30
      C -22 36, -22 46, -16 52
      C -10 58, 0 58, 6 52
      L 30 28
      C 36 22, 36 12, 30 6
      C 24 0, 14 0, 8 6 Z
    " fill="#FFFFFF"/>

    <!-- Finger 3 -->
    <path d="
      M 22 20
      L -2 44
      C -8 50, -8 60, -2 66
      C 4 72, 14 72, 20 66
      L 44 42
      C 50 36, 50 26, 44 20
      C 38 14, 28 14, 22 20 Z
    " fill="#FFFFFF"/>

    <!-- Finger 4 (Pinky) -->
    <path d="
      M 36 34
      L 12 58
      C 6 64, 6 74, 12 80
      C 18 86, 28 86, 34 80
      L 58 56
      C 64 50, 64 40, 58 34
      C 52 28, 42 28, 36 34 Z
    " fill="#FFFFFF"/>

    <!-- Dividing Gap Strokes in Blue #2B7FFF -->
    <line x1="0" y1="0" x2="-24" y2="24" stroke="${strokeColor}" stroke-width="4" stroke-linecap="round"/>
    <line x1="14" y1="14" x2="-10" y2="38" stroke="${strokeColor}" stroke-width="4" stroke-linecap="round"/>
    <line x1="28" y1="28" x2="4" y2="52" stroke="${strokeColor}" stroke-width="4" stroke-linecap="round"/>
    <line x1="-8" y1="-28" x2="16" y2="-4" stroke="${strokeColor}" stroke-width="4" stroke-linecap="round"/>
  </g>
  `
}

/**
 * 1. CELENGAN AYAM NUSANTARA (Rooster Piggy Bank)
 * Classic Indonesian Celengan Ayam in modern flat 2D vector style.
 */
export function getCelenganAyamNusantaraSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- PRIMARY COLOR: Modern Electric Blue #2B7FFF -->
  <!-- ACCENT COLOR: Pure White #FFFFFF -->
  <!-- BACKGROUND: Transparent -->
  
  <g id="celengan-ayam-nusantara">
    <!-- Top Coin Slot Accent -->
    <rect x="216" y="108" width="80" height="14" rx="7" fill="#FFFFFF" opacity="0.95"/>

    <!-- Main Rooster Silhouette -->
    <path fill="#2B7FFF" fill-rule="evenodd" clip-rule="evenodd" d="
      M 205 132
      C 188 132, 172 138, 160 148
      C 152 126, 138 108, 118 100
      C 98 92, 76 98, 66 116
      C 54 110, 40 114, 32 126
      C 22 140, 24 158, 34 170
      C 20 178, 12 196, 16 214
      C 20 230, 32 242, 48 246
      C 30 254, 18 266, 6 280
      C 24 286, 44 288, 62 284
      C 54 298, 56 314, 66 326
      C 76 338, 92 342, 106 338
      C 114 378, 144 410, 182 424
      L 172 458
      C 170 466, 176 474, 184 474
      L 222 474
      C 230 474, 237 467, 239 459
      L 245 428
      C 252 429, 260 429, 267 428
      L 273 459
      C 275 467, 282 474, 290 474
      L 328 474
      C 336 474, 342 466, 340 458
      L 330 424
      C 372 408, 404 372, 412 328
      C 436 342, 466 338, 484 318
      C 502 296, 506 266, 492 242
      C 506 218, 500 188, 482 166
      C 462 142, 432 136, 406 150
      C 406 124, 390 102, 368 92
      C 344 80, 316 88, 298 108
      C 270 96, 238 96, 208 108
      C 204 116, 203 124, 205 132
      Z
    "/>

    <!-- Plumage Accents in Pure White -->
    <path d="M 412 250 C 445 238, 470 216, 480 182" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.4"/>
    <path d="M 406 295 C 440 285, 465 260, 475 235" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.4"/>

    <!-- Eye in White -->
    <circle cx="78" cy="226" r="6" fill="#FFFFFF"/>

    <!-- Handshake in Center -->
    ${createHandshake(256, 295, 1.05, "#2B7FFF")}
  </g>
</svg>`
}

/**
 * 2. CELENGAN BULAT MODERN (Round Piggy Bank)
 * Ultra-clean modern geometric round piggy bank with handshake.
 */
export function getCelenganBulatModernSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- PRIMARY COLOR: Modern Electric Blue #2B7FFF -->
  <!-- ACCENT COLOR: Pure White #FFFFFF -->
  <!-- BACKGROUND: Transparent -->
  
  <g id="celengan-bulat-modern">
    <!-- Top Coin Slot Opening -->
    <rect x="216" y="80" width="80" height="15" rx="7.5" fill="#2B7FFF"/>

    <!-- Main Piggy Bank Body (Clean Round Silhouette) -->
    <path fill="#2B7FFF" fill-rule="evenodd" clip-rule="evenodd" d="
      M 256 112
      C 336 112, 402 158, 430 222
      C 450 220, 468 232, 474 252
      L 480 270
      C 486 288, 476 308, 458 314
      C 450 316, 442 316, 436 313
      C 416 376, 350 422, 272 422
      C 252 422, 234 418, 216 410
      L 204 452
      C 201 460, 193 466, 184 466
      L 148 466
      C 139 466, 131 458, 133 448
      L 142 406
      C 118 388, 98 364, 86 336
      L 58 348
      C 48 353, 36 348, 31 338
      C 26 328, 31 316, 41 311
      L 66 299
      C 60 280, 56 260, 56 238
      C 56 168, 116 112, 188 112
      C 210 112, 234 112, 256 112
      Z
      M 345 116
      L 380 68
      C 386 58, 400 60, 406 70
      L 418 102
      C 422 112, 416 122, 404 124
      L 366 130
      Z
    "/>

    <!-- Bottom Right Leg -->
    <path d="
      M 306 408
      L 318 452
      C 320 460, 328 466, 337 466
      L 373 466
      C 382 466, 390 460, 388 450
      L 374 404
      Z
    " fill="#2B7FFF"/>

    <!-- Snout Nostril Dots -->
    <circle cx="458" cy="260" r="4.5" fill="#FFFFFF" opacity="0.85"/>
    <circle cx="458" cy="276" r="4.5" fill="#FFFFFF" opacity="0.85"/>

    <!-- Eye in White -->
    <circle cx="396" cy="198" r="6.5" fill="#FFFFFF"/>

    <!-- Handshake in Center -->
    ${createHandshake(256, 280, 1.05, "#2B7FFF")}
  </g>
</svg>`
}

/**
 * 3. MASTER EMBLEM APP ICON (Squircle for App Home Screen / PWA / Superadmin)
 */
export function getEmblemAppIconSVG(variant = "ayam") {
  const isAyam = variant === "ayam"
  const logoSVG = isAyam
    ? getCelenganAyamNusantaraSVG()
    : getCelenganBulatModernSVG()
  const innerContent = logoSVG.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "")

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="appBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090E17"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <radialGradient id="electricHalo" cx="50%" cy="52%" r="50%">
      <stop offset="0%" stop-color="#2B7FFF" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#2B7FFF" stop-opacity="0"/>
    </radialGradient>
    <filter id="iconShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- iOS / Android Squircle Container -->
  <rect width="512" height="512" rx="116" fill="url(#appBgGrad)"/>
  
  <!-- Subtle Glowing Radial Ambient -->
  <circle cx="256" cy="270" r="180" fill="url(#electricHalo)"/>

  <!-- Logo Graphics centered & scaled -->
  <g transform="translate(18, 10) scale(0.93)" filter="url(#iconShadow)">
    ${innerContent}
  </g>
</svg>`
}

async function renderAll() {
  const svgAyam = getCelenganAyamNusantaraSVG()
  const svgBulat = getCelenganBulatModernSVG()
  const svgAppIconAyam = getEmblemAppIconSVG("ayam")
  const svgAppIconBulat = getEmblemAppIconSVG("bulat")

  fs.writeFileSync(path.join(artifactDir, "logo-celengan-ayam.svg"), svgAyam)
  fs.writeFileSync(path.join(artifactDir, "logo-celengan-bulat.svg"), svgBulat)
  fs.writeFileSync(
    path.join(artifactDir, "logo-app-icon-ayam.svg"),
    svgAppIconAyam,
  )
  fs.writeFileSync(
    path.join(artifactDir, "logo-app-icon-bulat.svg"),
    svgAppIconBulat,
  )

  await sharp(Buffer.from(svgAyam))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "v3_ayam_512.png"))
  await sharp(Buffer.from(svgBulat))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "v3_bulat_512.png"))
  await sharp(Buffer.from(svgAppIconAyam))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "v3_appicon_ayam_512.png"))
  await sharp(Buffer.from(svgAppIconBulat))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "v3_appicon_bulat_512.png"))

  console.log("Successfully generated v3 SVGs and PNG previews!")
}

renderAll().catch(console.error)
