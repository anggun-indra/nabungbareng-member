import sharp from "sharp"
import path from "node:path"
import fs from "node:fs"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const svgPath = path.resolve(__dirname, "../public/icon.svg")
const publicDir = path.resolve(__dirname, "../public")

const svgBuffer = fs.readFileSync(svgPath)

async function generate() {
  console.log("Generating PWA icons...")

  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, "icon-192.png"))

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, "icon-512.png"))

  // 180x180 apple touch icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, "apple-touch-icon.png"))

  // 64x64 favicon
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, "favicon.png"))

  // Maskable icons (80% scaled inside 100% canvas with #0F172A background)
  const maskable192 = await sharp(svgBuffer).resize(154, 154).toBuffer()

  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 },
    },
  })
    .composite([{ input: maskable192, gravity: "center" }])
    .png()
    .toFile(path.join(publicDir, "icon-192-maskable.png"))

  const maskable512 = await sharp(svgBuffer).resize(410, 410).toBuffer()

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 },
    },
  })
    .composite([{ input: maskable512, gravity: "center" }])
    .png()
    .toFile(path.join(publicDir, "icon-512-maskable.png"))

  console.log("All PWA icons generated successfully!")
}

generate().catch((err) => {
  console.error("Error generating icons:", err)
  process.exit(1)
})
