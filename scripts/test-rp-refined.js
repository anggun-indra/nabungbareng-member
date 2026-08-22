import sharp from "sharp"
import fs from "node:fs"
import path from "node:path"

const artifactDir =
  "/Users/nb-mac-fj2n0x/.gemini/antigravity/brain/3c79ec51-9a3e-439b-9cfe-cf814fc4b2b1"

// Refined Rp vector emblem with optical centering and modern geometric curves
// Total width ~176px, height ~110px. Center of body is (256, 295).
function getRpEmblemPath(scale = 1.0) {
  return `
  <g id="rp-emblem" transform="translate(256, 295) scale(${scale})">
    <!-- R (Capital) -->
    <!-- R Main Body & Loop & Leg -->
    <path d="
      M -78 -48
      L -26 -48
      C -4 -48, 12 -34, 12 -14
      C 12 1, 0 14, -16 16
      L 14 50
      L -12 50
      L -36 18
      L -54 18
      L -54 50
      L -78 50
      Z
      M -54 -26
      L -54 -4
      L -24 -4
      C -11 -4, -4 -8, -4 -15
      C -4 -22, -11 -26, -24 -26
      Z
    " fill="#FFFFFF"/>

    <!-- p (Lowercase) -->
    <!-- p Stem & Rounded Geometric Bowl -->
    <path d="
      M 24 -18
      L 46 -18
      L 46 -5
      C 54 -14, 66 -20, 80 -20
      C 102 -20, 118 -3, 118 20
      C 118 43, 102 60, 80 60
      C 66 60, 54 54, 46 45
      L 46 72
      L 24 72
      Z
      M 46 20
      C 46 32, 56 42, 70 42
      C 84 42, 94 32, 94 20
      C 94 8, 84 -2, 70 -2
      C 56 -2, 46 8, 46 20
      Z
    " fill="#FFFFFF"/>
  </g>
  `
}

// Bulat piggy has center at (256, 285)
function getRpEmblemBulat(scale = 1.0) {
  return `
  <g id="rp-emblem-bulat" transform="translate(256, 285) scale(${scale})">
    <path d="
      M -78 -48
      L -26 -48
      C -4 -48, 12 -34, 12 -14
      C 12 1, 0 14, -16 16
      L 14 50
      L -12 50
      L -36 18
      L -54 18
      L -54 50
      L -78 50
      Z
      M -54 -26
      L -54 -4
      L -24 -4
      C -11 -4, -4 -8, -4 -15
      C -4 -22, -11 -26, -24 -26
      Z
    " fill="#FFFFFF"/>

    <path d="
      M 24 -18
      L 46 -18
      L 46 -5
      C 54 -14, 66 -20, 80 -20
      C 102 -20, 118 -3, 118 20
      C 118 43, 102 60, 80 60
      C 66 60, 54 54, 46 45
      L 46 72
      L 24 72
      Z
      M 46 20
      C 46 32, 56 42, 70 42
      C 84 42, 94 32, 94 20
      C 94 8, 84 -2, 70 -2
      C 56 -2, 46 8, 46 20
      Z
    " fill="#FFFFFF"/>
  </g>
  `
}

// Test scales: 0.95, 1.0, 1.1
function buildAyamWithScale(scale, color = "#2B7FFF") {
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
    
    ${getRpEmblemPath(scale)}
  </g>
</svg>`
}

async function run() {
  const s1 = buildAyamWithScale(0.95, "#2B7FFF")
  const s2 = buildAyamWithScale(1.05, "#2B7FFF")
  const s2Admin = buildAyamWithScale(1.05, "#0F766E")

  await sharp(Buffer.from(s1))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "rp_scale_095.png"))
  await sharp(Buffer.from(s2))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "rp_scale_105.png"))
  await sharp(Buffer.from(s2Admin))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "rp_admin_105.png"))

  console.log("Scale tests completed!")
}

run().catch(console.error)
