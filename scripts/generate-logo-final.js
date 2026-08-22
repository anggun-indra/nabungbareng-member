import sharp from "sharp"
import fs from "node:fs"
import path from "node:path"

const artifactDir =
  "/Users/nb-mac-fj2n0x/.gemini/antigravity/brain/3c79ec51-9a3e-439b-9cfe-cf814fc4b2b1"

/**
 * ULTRA-CRISP HANDSHAKE SILHOUETTE
 * Vector-perfect representation of trust, partnership, and community amanah.
 */
function getHandshakeSVG(
  cx = 256,
  cy = 295,
  scale = 1.05,
  strokeColor = "#2B7FFF",
) {
  return `
  <!-- HANDSHAKE (Amanah & Kerja Sama) -->
  <g id="handshake" transform="translate(${cx}, ${cy}) scale(${scale})">
    <!-- Left Sleeve Cuff -->
    <path d="
      M -110 -26 
      L -76 -48 
      C -72 -51, -66 -50, -63 -46 
      L -48 -22 
      C -45 -18, -46 -12, -50 -9 
      L -84 13 
      C -88 16, -94 15, -97 11 
      L -112 -13 
      C -115 -17, -114 -23, -110 -26 Z
    " fill="#FFFFFF"/>
    
    <!-- Right Sleeve Cuff -->
    <path d="
      M 110 -26 
      L 76 -48 
      C 72 -51, 66 -50, 63 -46 
      L 48 -22 
      C 45 -18, 46 -12, 50 -9 
      L 84 13 
      C 88 16, 94 15, 97 11 
      L 112 -13 
      C 115 -17, 114 -23, 110 -26 Z
    " fill="#FFFFFF"/>

    <!-- Left Hand Palm & Thumb (Crosses gracefully over right hand) -->
    <path d="
      M -66 -16
      L -30 -40
      C -18 -48, -2 -44, 6 -32
      C 14 -20, 30 -18, 46 -22
      C 54 -24, 62 -18, 64 -10
      C 66 -2, 60 6, 52 8
      L 26 14
      C 12 18, -2 12, -12 2
      L -34 24
      C -42 32, -54 34, -64 28
      L -74 18
      Z
    " fill="#FFFFFF"/>

    <!-- Right Hand Palm & Thumb (Crosses under left palm) -->
    <path d="
      M 66 -16
      L 30 -40
      C 18 -48, 2 -44, -6 -32
      L -20 -18
      C -28 -10, -30 2, -22 10
      L 12 44
      C 20 52, 32 56, 44 52
      L 62 42
      C 70 34, 74 24, 72 14
      Z
    " fill="#FFFFFF"/>

    <!-- 4 Interlocking Fingers of the Right Hand (parallel diagonal bands) -->
    <!-- Finger 1 (Index) -->
    <path d="
      M -6 -8
      L -30 16
      C -36 22, -36 32, -30 38
      C -24 44, -14 44, -8 38
      L 16 14
      C 22 8, 22 -2, 16 -8
      C 10 -14, 0 -14, -6 -8 Z
    " fill="#FFFFFF"/>

    <!-- Finger 2 (Middle) -->
    <path d="
      M 8 6
      L -16 30
      C -22 36, -22 46, -16 52
      C -10 58, 0 58, 6 52
      L 30 28
      C 36 22, 36 12, 30 6
      C 24 0, 14 0, 8 6 Z
    " fill="#FFFFFF"/>

    <!-- Finger 3 (Ring) -->
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

    <!-- Separation Lines / Cutouts between fingers and thumb -->
    <line x1="0" y1="0" x2="-24" y2="24" stroke="${strokeColor}" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="14" y1="14" x2="-10" y2="38" stroke="${strokeColor}" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="28" y1="28" x2="4" y2="52" stroke="${strokeColor}" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="-8" y1="-28" x2="16" y2="-4" stroke="${strokeColor}" stroke-width="4.5" stroke-linecap="round"/>
  </g>
  `
}

/**
 * 1. CELENGAN AYAM NUSANTARA (Rooster Piggy Bank) - Flat 2D Vector
 */
export function getCelenganAyamFinalSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- NABUNG BARENG - LOGO CELENGAN AYAM NUSANTARA -->
  <!-- Primary: Modern Electric Blue #2B7FFF | Accent: Pure White #FFFFFF -->
  <g id="celengan-ayam-nusantara">
    <!-- Top Coin Dropping into Slot -->
    <circle cx="256" cy="116" r="26" fill="#FFFFFF"/>
    <circle cx="256" cy="116" r="17" fill="#2B7FFF"/>
    
    <!-- Top Coin Slot Base -->
    <rect x="208" y="142" width="96" height="16" rx="8" fill="#FFFFFF"/>

    <!-- Two Sturdy Rounded Feet -->
    <rect x="182" y="390" width="50" height="64" rx="18" fill="#2B7FFF"/>
    <rect x="280" y="390" width="50" height="64" rx="18" fill="#2B7FFF"/>

    <!-- Rooster Tail Feathers (3 Sweeping Dynamic Plumes on Right) -->
    <path d="
      M 340 240
      C 370 175, 420 115, 462 115
      C 478 115, 482 132, 470 152
      C 448 190, 398 240, 358 280
      Z
    " fill="#2B7FFF"/>

    <path d="
      M 350 270
      C 390 228, 452 195, 486 205
      C 498 210, 498 228, 482 246
      C 455 278, 405 310, 358 320
      Z
    " fill="#2B7FFF"/>

    <path d="
      M 340 310
      C 380 298, 442 288, 472 302
      C 482 308, 478 322, 462 336
      C 430 362, 380 368, 335 358
      Z
    " fill="#2B7FFF"/>

    <!-- Tail Feather Divider Highlights in White -->
    <path d="M 368 245 C 410 198, 446 156, 466 136" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" opacity="0.35"/>
    <path d="M 374 285 C 416 252, 456 230, 476 220" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" opacity="0.35"/>

    <!-- Main Central Round Piggy Savings Vault -->
    <circle cx="256" cy="295" r="142" fill="#2B7FFF"/>

    <!-- Rooster Head, Neck, Beak, and Wattle (Integrated seamlessly on Left) -->
    <!-- Head & Neck -->
    <path d="
      M 195 210
      C 170 185, 150 165, 135 165
      C 118 165, 105 180, 105 200
      C 105 224, 125 264, 168 325
      Z
    " fill="#2B7FFF"/>

    <!-- 3-Lobed Jengger (Comb) Crown -->
    <!-- Front Lobe -->
    <circle cx="112" cy="146" r="18" fill="#2B7FFF"/>
    <!-- Middle Lobe (Crown peak) -->
    <circle cx="136" cy="126" r="22" fill="#2B7FFF"/>
    <!-- Back Lobe -->
    <circle cx="166" cy="138" r="18" fill="#2B7FFF"/>

    <!-- Beak (Paruh Ayam) -->
    <path d="
      M 108 186
      L 62 200
      L 108 214
      Z
    " fill="#2B7FFF"/>

    <!-- Wattle (Gelambir) -->
    <path d="
      M 114 214
      C 100 214, 92 228, 96 242
      C 100 254, 116 260, 128 250
      C 136 242, 136 228, 128 218
      Z
    " fill="#2B7FFF"/>

    <!-- Eye in White -->
    <circle cx="130" cy="188" r="6.5" fill="#FFFFFF"/>

    <!-- Handshake Silhouette inside the Body -->
    ${getHandshakeSVG(256, 295, 1.05, "#2B7FFF")}
  </g>
</svg>`
}

/**
 * 2. CELENGAN BULAT MINIMALIS (Modern Round Piggy Bank) - Flat 2D Vector
 */
export function getCelenganBulatFinalSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- NABUNG BARENG - LOGO CELENGAN BULAT MINIMALIS -->
  <!-- Primary: Modern Electric Blue #2B7FFF | Accent: Pure White #FFFFFF -->
  <g id="celengan-bulat-minimalis">
    <!-- Top Coin Dropping into Slot -->
    <circle cx="256" cy="98" r="26" fill="#FFFFFF"/>
    <circle cx="256" cy="98" r="17" fill="#2B7FFF"/>

    <!-- Top Coin Slot Base -->
    <rect x="208" y="124" width="96" height="16" rx="8" fill="#FFFFFF"/>

    <!-- Two Sturdy Rounded Feet -->
    <rect x="182" y="380" width="50" height="64" rx="18" fill="#2B7FFF"/>
    <rect x="280" y="380" width="50" height="64" rx="18" fill="#2B7FFF"/>

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
    " fill="#FFFFFF" opacity="0.35"/>

    <!-- Snout (Right Side) -->
    <rect x="382" y="248" width="54" height="74" rx="27" fill="#2B7FFF"/>
    
    <!-- Nostril Dots -->
    <circle cx="416" cy="272" r="5" fill="#FFFFFF"/>
    <circle cx="416" cy="298" r="5" fill="#FFFFFF"/>

    <!-- Piggy Eye Dot in White -->
    <circle cx="362" cy="215" r="6.5" fill="#FFFFFF"/>

    <!-- Handshake Silhouette inside the Body -->
    ${getHandshakeSVG(256, 285, 1.05, "#2B7FFF")}
  </g>
</svg>`
}

/**
 * 3. LUXURY SQUIRCLE APP ICON CONTAINER (PWA / Mobile / Favicons)
 */
export function getAppIconContainerFinalSVG(variant = "ayam") {
  const isAyam = variant === "ayam"
  const logoSVG = isAyam
    ? getCelenganAyamFinalSVG()
    : getCelenganBulatFinalSVG()
  const innerContent = logoSVG.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "")

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="squircleBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080D1A"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <radialGradient id="electricAtmosphere" cx="50%" cy="52%" r="50%">
      <stop offset="0%" stop-color="#2B7FFF" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#2B7FFF" stop-opacity="0"/>
    </radialGradient>
    <filter id="iconSoftShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.55"/>
    </filter>
  </defs>

  <!-- iOS / Android Squircle App Icon Container -->
  <rect width="512" height="512" rx="116" fill="url(#squircleBgGrad)"/>
  
  <!-- Ambient Electric Blue Glow -->
  <circle cx="256" cy="270" r="185" fill="url(#electricAtmosphere)"/>

  <!-- Scaled Logo Graphics -->
  <g transform="translate(18, 10) scale(0.93)" filter="url(#iconSoftShadow)">
    ${innerContent}
  </g>
</svg>`
}

async function renderFinals() {
  const svgAyam = getCelenganAyamFinalSVG()
  const svgBulat = getCelenganBulatFinalSVG()
  const svgAppIconAyam = getAppIconContainerFinalSVG("ayam")
  const svgAppIconBulat = getAppIconContainerFinalSVG("bulat")

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
    .toFile(path.join(artifactDir, "final_ayam_512.png"))
  await sharp(Buffer.from(svgBulat))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "final_bulat_512.png"))
  await sharp(Buffer.from(svgAppIconAyam))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "final_appicon_ayam_512.png"))
  await sharp(Buffer.from(svgAppIconBulat))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "final_appicon_bulat_512.png"))

  console.log("Successfully generated FINAL SVGs and PNG previews!")
}

renderFinals().catch(console.error)
