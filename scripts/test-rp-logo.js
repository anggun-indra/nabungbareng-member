import sharp from "sharp"
import fs from "node:fs"
import path from "node:path"

const artifactDir =
  "/Users/nb-mac-fj2n0x/.gemini/antigravity/brain/3c79ec51-9a3e-439b-9cfe-cf814fc4b2b1"

// Test Rp with modern bold typography in pure white #FFFFFF
function createTestSvg(color = "#2B7FFF") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- NabungBareng - Logo Celengan Ayam with 'Rp' Center -->
  <g id="nabungbareng-celengan-ayam">
    <!-- Coin Entering Slot -->
    <circle cx="256" cy="116" r="26" fill="#FFFFFF"/>
    <circle cx="256" cy="116" r="16" fill="${color}"/>
    
    <!-- Coin Slot -->
    <rect x="208" y="142" width="96" height="16" rx="8" fill="#FFFFFF"/>

    <!-- Feet -->
    <rect x="182" y="390" width="50" height="64" rx="18" fill="${color}"/>
    <rect x="280" y="390" width="50" height="64" rx="18" fill="${color}"/>

    <!-- Rooster Tail Feathers -->
    <path d="
      M 340 240
      C 370 175, 420 115, 462 115
      C 478 115, 482 132, 470 152
      C 448 190, 398 240, 358 280
      Z
    " fill="${color}"/>

    <path d="
      M 350 270
      C 390 228, 452 195, 486 205
      C 498 210, 498 228, 482 246
      C 455 278, 405 310, 358 320
      Z
    " fill="${color}"/>

    <path d="
      M 340 310
      C 380 298, 442 288, 472 302
      C 482 308, 478 322, 462 336
      C 430 362, 380 368, 335 358
      Z
    " fill="${color}"/>

    <!-- Tail Accents -->
    <path d="M 368 245 C 410 198, 446 156, 466 136" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" opacity="0.35"/>
    <path d="M 374 285 C 416 252, 456 230, 476 220" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" opacity="0.35"/>

    <!-- Main Central Piggy Body -->
    <circle cx="256" cy="295" r="142" fill="${color}"/>

    <!-- Rooster Head & Neck -->
    <path d="
      M 195 210
      C 170 185, 150 165, 135 165
      C 118 165, 105 180, 105 200
      C 105 224, 125 264, 168 325
      Z
    " fill="${color}"/>

    <!-- Comb (Jengger) -->
    <circle cx="112" cy="146" r="18" fill="${color}"/>
    <circle cx="136" cy="126" r="22" fill="${color}"/>
    <circle cx="166" cy="138" r="18" fill="${color}"/>

    <!-- Beak -->
    <path d="M 108 186 L 62 200 L 108 214 Z" fill="${color}"/>

    <!-- Wattle -->
    <path d="
      M 114 214
      C 100 214, 92 228, 96 242
      C 100 254, 116 260, 128 250
      C 136 242, 136 228, 128 218
      Z
    " fill="${color}"/>

    <!-- Eye -->
    <circle cx="130" cy="188" r="6.5" fill="#FFFFFF"/>

    <!-- 'Rp' Center Emblem in Pure White #FFFFFF -->
    <!-- Stylized Modern Geometric Vector Rp -->
    <text 
      x="256" 
      y="332" 
      font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" 
      font-weight="900" 
      font-size="112" 
      fill="#FFFFFF" 
      text-anchor="middle"
      letter-spacing="-3"
    >Rp</text>
  </g>
</svg>`
}

async function test() {
  const memberSvg = createTestSvg("#2B7FFF")
  const adminSvg = createTestSvg("#0F766E")

  await sharp(Buffer.from(memberSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "test_rp_member_512.png"))
  await sharp(Buffer.from(adminSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "test_rp_admin_512.png"))

  console.log("Test images generated successfully!")
}

test().catch(console.error)
