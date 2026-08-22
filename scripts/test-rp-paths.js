import sharp from "sharp"
import fs from "node:fs"
import path from "node:path"

const artifactDir =
  "/Users/nb-mac-fj2n0x/.gemini/antigravity/brain/3c79ec51-9a3e-439b-9cfe-cf814fc4b2b1"

// Style 1: Converted precise geometric bold vector paths for "Rp"
// Centered at (256, 295)
const rpVectorStyle1 = `
  <g id="rp-symbol" transform="translate(256, 295)">
    <!-- R Glyph -->
    <path d="
      M -68 -46
      L -26 -46
      C -8 -46, 4 -36, 4 -18
      C 4 -4, -6 6, -20 8
      L 4 46
      L -18 46
      L -38 12
      L -50 12
      L -50 46
      L -68 46
      Z
      M -50 -30
      L -50 -4
      L -25 -4
      C -15 -4, -8 -8, -8 -17
      C -8 -26, -15 -30, -25 -30
      Z
    " fill="#FFFFFF"/>
    
    <!-- p Glyph -->
    <path d="
      M 16 -18
      L 32 -18
      L 32 -6
      C 38 -14, 48 -20, 60 -20
      C 78 -20, 92 -4, 92 16
      C 92 36, 78 52, 60 52
      C 48 52, 38 46, 32 38
      L 32 64
      L 16 64
      Z
      M 32 16
      C 32 26, 40 36, 52 36
      C 64 36, 72 26, 72 16
      C 72 6, 64 -4, 52 -4
      C 40 -4, 32 6, 32 16
      Z
    " fill="#FFFFFF"/>
  </g>
`

// Style 2: Rounded Modern Geometric Heavy Weight (matches app playful modern tone)
const rpVectorStyle2 = `
  <g id="rp-symbol-rounded" transform="translate(256, 295)">
    <!-- R Glyph with soft rounded joints -->
    <path d="
      M -68 -44
      L -24 -44
      C -4 -44, 10 -32, 10 -14
      C 10 -1, -1 10, -14 12
      L 10 44
      L -12 44
      L -32 14
      L -48 14
      L -48 44
      L -68 44
      Z
      M -48 -26
      L -48 -2
      L -22 -2
      C -11 -2, -6 -6, -6 -14
      C -6 -22, -11 -26, -22 -26
      Z
    " fill="#FFFFFF"/>
    
    <!-- p Glyph -->
    <path d="
      M 18 -14
      L 36 -14
      L 36 -3
      C 42 -11, 52 -16, 64 -16
      C 82 -16, 96 0, 96 20
      C 96 40, 82 56, 64 56
      C 52 56, 42 51, 36 43
      L 36 64
      L 18 64
      Z
      M 36 20
      C 36 30, 44 39, 56 39
      C 68 39, 76 30, 76 20
      C 76 10, 68 1, 56 1
      C 44 1, 36 10, 36 20
      Z
    " fill="#FFFFFF"/>
  </g>
`

function buildFullSvg(rpContent, color = "#2B7FFF") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <g id="nabungbareng-celengan-ayam">
    <circle cx="256" cy="116" r="26" fill="#FFFFFF"/>
    <circle cx="256" cy="116" r="16" fill="${color}"/>
    <rect x="208" y="142" width="96" height="16" rx="8" fill="#FFFFFF"/>
    <rect x="182" y="390" width="50" height="64" rx="18" fill="${color}"/>
    <rect x="280" y="390" width="50" height="64" rx="18" fill="${color}"/>
    <path d="M 340 240 C 370 175, 420 115, 462 115 C 478 115, 482 132, 470 152 C 448 190, 398 240, 358 280 Z" fill="${color}"/>
    <path d="M 350 270 C 390 228, 452 195, 486 205 C 498 210, 498 228, 482 246 C 455 278, 405 310, 358 320 Z" fill="${color}"/>
    <path d="M 340 310 C 380 298, 442 288, 472 302 C 482 308, 478 322, 462 336 C 430 362, 380 368, 335 358 Z" fill="${color}"/>
    <path d="M 368 245 C 410 198, 446 156, 466 136" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" opacity="0.35"/>
    <path d="M 374 285 C 416 252, 456 230, 476 220" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" opacity="0.35"/>
    <circle cx="256" cy="295" r="142" fill="${color}"/>
    <path d="M 195 210 C 170 185, 150 165, 135 165 C 118 165, 105 180, 105 200 C 105 224, 125 264, 168 325 Z" fill="${color}"/>
    <circle cx="112" cy="146" r="18" fill="${color}"/>
    <circle cx="136" cy="126" r="22" fill="${color}"/>
    <circle cx="166" cy="138" r="18" fill="${color}"/>
    <path d="M 108 186 L 62 200 L 108 214 Z" fill="${color}"/>
    <path d="M 114 214 C 100 214, 92 228, 96 242 C 100 254, 116 260, 128 250 C 136 242, 136 228, 128 218 Z" fill="${color}"/>
    <circle cx="130" cy="188" r="6.5" fill="#FFFFFF"/>
    
    ${rpContent}
  </g>
</svg>`
}

async function renderStyles() {
  const svg1 = buildFullSvg(rpVectorStyle1, "#2B7FFF")
  const svg2 = buildFullSvg(rpVectorStyle2, "#2B7FFF")
  const svg2Admin = buildFullSvg(rpVectorStyle2, "#0F766E")

  await sharp(Buffer.from(svg1))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "rp_style1_512.png"))
  await sharp(Buffer.from(svg2))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "rp_style2_512.png"))
  await sharp(Buffer.from(svg2Admin))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "rp_style2_admin_512.png"))

  console.log("Generated Rp vector style previews!")
}

renderStyles().catch(console.error)
