import sharp from "sharp"
import fs from "node:fs"
import path from "node:path"

const artifactDir =
  "/Users/nb-mac-fj2n0x/.gemini/antigravity/brain/3c79ec51-9a3e-439b-9cfe-cf814fc4b2b1"

/**
 * Handshake Silhouette Component
 * @param {number} cx Center X
 * @param {number} cy Center Y
 * @param {number} scale Scale multiplier
 * @param {string} strokeColor Gap stroke color (matches body background)
 */
function getHandshakeGroup(
  cx = 256,
  cy = 295,
  scale = 1.05,
  strokeColor = "#2B7FFF",
) {
  return `
  <g id="handshake-emblem" transform="translate(${cx}, ${cy}) scale(${scale})">
    <!-- Left Sleeve Cuff -->
    <path d="
      M -112 -28 
      L -78 -50 
      C -74 -53, -68 -52, -65 -48 
      L -50 -25 
      C -47 -21, -48 -15, -52 -12 
      L -86 10 
      C -90 13, -96 12, -99 8 
      L -114 -15 
      C -117 -19, -116 -25, -112 -28 Z
    " fill="#FFFFFF"/>
    
    <!-- Right Sleeve Cuff -->
    <path d="
      M 112 -28 
      L 78 -50 
      C 74 -53, 68 -52, 65 -48 
      L 50 -25 
      C 47 -21, 48 -15, 52 -12 
      L 86 10 
      C 90 13, 96 12, 99 8 
      L 114 -15 
      C 117 -19, 116 -25, 112 -28 Z
    " fill="#FFFFFF"/>

    <!-- Left Hand Palm & Thumb crossing over -->
    <path d="
      M -68 -18
      L -32 -42
      C -20 -50, -4 -46, 4 -34
      C 12 -22, 28 -20, 44 -24
      C 52 -26, 60 -20, 62 -12
      C 64 -4, 58 4, 50 6
      L 24 12
      C 10 16, -4 10, -14 0
      L -36 22
      C -44 30, -56 32, -66 26
      L -76 16
      Z
    " fill="#FFFFFF"/>

    <!-- Right Hand Palm & Base -->
    <path d="
      M 68 -18
      L 32 -42
      C 20 -50, 4 -46, -4 -34
      L -18 -20
      C -26 -12, -28 0, -20 8
      L 14 42
      C 22 50, 34 54, 46 50
      L 64 40
      C 72 32, 76 22, 74 12
      Z
    " fill="#FFFFFF"/>

    <!-- 4 Interlocking Fingers of Right Hand -->
    <!-- Finger 1 -->
    <path d="
      M -6 -10
      L -30 14
      C -36 20, -36 30, -30 36
      C -24 42, -14 42, -8 36
      L 16 12
      C 22 6, 22 -4, 16 -10
      C 10 -16, 0 -16, -6 -10 Z
    " fill="#FFFFFF"/>

    <!-- Finger 2 -->
    <path d="
      M 8 4
      L -16 28
      C -22 34, -22 44, -16 50
      C -10 56, 0 56, 6 50
      L 30 26
      C 36 20, 36 10, 30 4
      C 24 -2, 14 -2, 8 4 Z
    " fill="#FFFFFF"/>

    <!-- Finger 3 -->
    <path d="
      M 22 18
      L -2 42
      C -8 48, -8 58, -2 64
      C 4 70, 14 70, 20 64
      L 44 40
      C 50 34, 50 24, 44 18
      C 38 12, 28 12, 22 18 Z
    " fill="#FFFFFF"/>

    <!-- Finger 4 (Pinky) -->
    <path d="
      M 36 32
      L 12 56
      C 6 62, 6 72, 12 78
      C 18 84, 28 84, 34 78
      L 58 54
      C 64 48, 64 38, 58 32
      C 52 26, 42 26, 36 32 Z
    " fill="#FFFFFF"/>

    <!-- Precision separation lines in body stroke color -->
    <line x1="0" y1="-2" x2="-24" y2="22" stroke="${strokeColor}" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="14" y1="12" x2="-10" y2="36" stroke="${strokeColor}" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="28" y1="26" x2="4" y2="50" stroke="${strokeColor}" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="-8" y1="-30" x2="16" y2="-6" stroke="${strokeColor}" stroke-width="4.5" stroke-linecap="round"/>
  </g>
  `
}

/**
 * 1. CELENGAN AYAM NUSANTARA (Rooster Piggy Bank)
 * Engineered with distinct geometric sections:
 * - Proud rooster head with 3-lobed comb, beak, and wattle on left
 * - Large circular piggy savings vault in center
 * - Dynamic 3-plume sweeping rooster tail on right
 * - Sturdy rounded feet at bottom
 * - Top coin slot with coin
 * - Pure white handshake in center
 */
export function buildCelenganAyamMasterSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- NABUNG BARENG - LOGO CELENGAN AYAM NUSANTARA -->
  <!-- Primary: Modern Electric Blue #2B7FFF | Accent: Pure White #FFFFFF -->
  <g id="celengan-ayam-logo">
    <!-- Coin Dropping into Slot -->
    <circle cx="256" cy="116" r="28" fill="#FFFFFF"/>
    <circle cx="256" cy="116" r="18" fill="#2B7FFF"/>
    
    <!-- Coin Slot Base -->
    <rect x="208" y="142" width="96" height="16" rx="8" fill="#FFFFFF"/>

    <!-- Rooster Tail Feathers (Layered 3 Sweeping Arcs on Right) -->
    <!-- Top Primary Feather -->
    <path d="
      M 340 240
      C 370 180, 420 120, 460 120
      C 475 120, 480 135, 470 155
      C 450 190, 400 240, 360 280
      Z
    " fill="#2B7FFF"/>

    <!-- Middle Feather -->
    <path d="
      M 350 270
      C 390 230, 450 200, 485 210
      C 495 215, 495 230, 480 248
      C 455 280, 405 310, 360 320
      Z
    " fill="#2B7FFF"/>

    <!-- Bottom Feather -->
    <path d="
      M 340 310
      C 380 300, 440 290, 470 305
      C 480 310, 475 325, 460 338
      C 430 365, 380 370, 335 360
      Z
    " fill="#2B7FFF"/>

    <!-- Tail Feather Separation Grooves in White -->
    <path d="M 370 245 C 410 200, 445 160, 465 140" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.3"/>
    <path d="M 375 285 C 415 255, 455 235, 475 225" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.3"/>

    <!-- Feet (Two Rounded Sturdy Pedestal Feet) -->
    <rect x="180" y="390" width="52" height="68" rx="18" fill="#2B7FFF"/>
    <rect x="280" y="390" width="52" height="68" rx="18" fill="#2B7FFF"/>

    <!-- Main Central Round Piggy Bank Body -->
    <circle cx="256" cy="295" r="142" fill="#2B7FFF"/>

    <!-- Rooster Neck & Head (Left Side) -->
    <!-- Neck Base merging into body -->
    <path d="
      M 195 215
      C 175 190, 160 170, 145 170
      C 130 170, 115 185, 115 205
      C 115 230, 135 270, 175 330
      Z
    " fill="#2B7FFF"/>

    <!-- Rooster Comb (Jengger Ayam) - 3 Bold Rounded Crowns -->
    <!-- Front Lobe -->
    <circle cx="120" cy="148" r="20" fill="#2B7FFF"/>
    <!-- Middle Lobe (Tallest) -->
    <circle cx="146" cy="130" r="24" fill="#2B7FFF"/>
    <!-- Back Lobe -->
    <circle cx="176" cy="144" r="20" fill="#2B7FFF"/>

    <!-- Beak (Paruh Ayam) -->
    <path d="
      M 118 190
      L 70 205
      L 118 220
      Z
    " fill="#2B7FFF"/>

    <!-- Wattle (Gelambir) below Beak -->
    <path d="
      M 124 220
      C 110 220, 102 235, 106 250
      C 110 262, 126 268, 138 258
      C 146 250, 146 235, 138 224
      Z
    " fill="#2B7FFF"/>

    <!-- Rooster Eye Dot in White -->
    <circle cx="140" cy="192" r="7" fill="#FFFFFF"/>

    <!-- Handshake Silhouette in the Center of the Body -->
    ${getHandshakeGroup(256, 295, 1.05, "#2B7FFF")}
  </g>
</svg>`
}

/**
 * 2. CELENGAN BULAT MINIMALIS (Modern Round Piggy Bank)
 * - Ultra-sleek circular piggy bank body
 * - Snout on right with nostril dots
 * - Triangular folded ear on top right
 * - Curled tail on left
 * - Sturdy feet
 * - Top coin slot with coin
 * - Handshake in center
 */
export function buildCelenganBulatMasterSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- NABUNG BARENG - LOGO CELENGAN BULAT MINIMALIS -->
  <!-- Primary: Modern Electric Blue #2B7FFF | Accent: Pure White #FFFFFF -->
  <g id="celengan-bulat-logo">
    <!-- Coin Dropping into Slot -->
    <circle cx="256" cy="100" r="28" fill="#FFFFFF"/>
    <circle cx="256" cy="100" r="18" fill="#2B7FFF"/>

    <!-- Top Coin Slot Base -->
    <rect x="208" y="126" width="96" height="16" rx="8" fill="#FFFFFF"/>

    <!-- Piggy Feet -->
    <rect x="180" y="380" width="52" height="68" rx="18" fill="#2B7FFF"/>
    <rect x="280" y="380" width="52" height="68" rx="18" fill="#2B7FFF"/>

    <!-- Curly Tail (Left Side) -->
    <path d="
      M 115 285
      C 75 270, 55 310, 80 335
      C 95 350, 115 330, 100 315
      C 92 308, 85 315, 88 322
    " stroke="#2B7FFF" stroke-width="18" stroke-linecap="round" fill="none"/>

    <!-- Main Round Piggy Body -->
    <circle cx="256" cy="285" r="148" fill="#2B7FFF"/>

    <!-- Piggy Ear (Top Right) -->
    <path d="
      M 320 148
      L 368 85
      C 376 75, 392 78, 396 90
      L 404 135
      C 408 148, 400 160, 386 164
      Z
    " fill="#2B7FFF"/>

    <!-- Inner Ear Accent in White -->
    <path d="
      M 345 138
      L 374 98
      C 378 92, 386 94, 388 100
      L 392 128
      Z
    " fill="#FFFFFF" opacity="0.3"/>

    <!-- Snout (Right Side) -->
    <rect x="380" y="248" width="54" height="74" rx="27" fill="#2B7FFF"/>
    
    <!-- Nostril Dots -->
    <circle cx="414" cy="272" r="5" fill="#FFFFFF"/>
    <circle cx="414" cy="298" r="5" fill="#FFFFFF"/>

    <!-- Piggy Eye Dot in White -->
    <circle cx="360" cy="215" r="7" fill="#FFFFFF"/>

    <!-- Handshake Silhouette in the Center of the Body -->
    ${getHandshakeGroup(256, 285, 1.05, "#2B7FFF")}
  </g>
</svg>`
}

/**
 * 3. LUXURY SQUIRCLE APP ICON CONTAINER (PWA / Mobile / Web App)
 */
export function buildAppIconContainerSVG(variant = "ayam") {
  const isAyam = variant === "ayam"
  const logoSVG = isAyam
    ? buildCelenganAyamMasterSVG()
    : buildCelenganBulatMasterSVG()
  const innerContent = logoSVG.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "")

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="squircleBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B1120"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <radialGradient id="blueAtmosphere" cx="50%" cy="52%" r="50%">
      <stop offset="0%" stop-color="#2B7FFF" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#2B7FFF" stop-opacity="0"/>
    </radialGradient>
    <filter id="iconSoftShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.55"/>
    </filter>
  </defs>

  <!-- iOS / Android Squircle Container -->
  <rect width="512" height="512" rx="116" fill="url(#squircleBg)"/>
  
  <!-- Subtle Ambient Glow -->
  <circle cx="256" cy="270" r="185" fill="url(#blueAtmosphere)"/>

  <!-- Logo centered & scaled -->
  <g transform="translate(18, 10) scale(0.93)" filter="url(#iconSoftShadow)">
    ${innerContent}
  </g>
</svg>`
}

async function renderMaster() {
  const svgAyam = buildCelenganAyamMasterSVG()
  const svgBulat = buildCelenganBulatMasterSVG()
  const svgAppIconAyam = buildAppIconContainerSVG("ayam")
  const svgAppIconBulat = buildAppIconContainerSVG("bulat")

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
    .toFile(path.join(artifactDir, "master_ayam_512.png"))
  await sharp(Buffer.from(svgBulat))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "master_bulat_512.png"))
  await sharp(Buffer.from(svgAppIconAyam))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "master_appicon_ayam_512.png"))
  await sharp(Buffer.from(svgAppIconBulat))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "master_appicon_bulat_512.png"))

  console.log("Successfully generated MASTER SVGs and PNG previews!")
}

renderMaster().catch(console.error)
