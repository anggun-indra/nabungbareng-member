import sharp from "sharp"
import fs from "node:fs"
import path from "node:path"

const artifactDir =
  "/Users/nb-mac-fj2n0x/.gemini/antigravity/brain/3c79ec51-9a3e-439b-9cfe-cf814fc4b2b1"

/**
 * World-Class Handshake Vector:
 * Two hands meeting in the center with sleeves, thumbs, and interlocking fingers.
 * Perfectly balanced across X = 256, Y = 280
 */
function getHandshakePath(accentStroke = "#2B7FFF") {
  return `
  <!-- HANDSHAKE (Trust & Community Partnership) -->
  <g id="handshake" transform="translate(256, 280)">
    <!-- Left Sleeve Cuff (Angled down-right ~30deg) -->
    <rect x="-115" y="-35" width="22" height="60" rx="6" transform="rotate(30, -104, -5)" fill="#FFFFFF"/>
    
    <!-- Right Sleeve Cuff (Angled down-left ~-30deg) -->
    <rect x="93" y="-35" width="22" height="60" rx="6" transform="rotate(-30, 104, -5)" fill="#FFFFFF"/>

    <!-- Left Hand Palm & Thumb (Coming from upper-left) -->
    <path d="
      M -90 -12
      L -45 -38
      C -32 -46, -14 -42, -5 -28
      C 4 -16, 22 -14, 38 -18
      C 46 -20, 54 -14, 55 -6
      C 56 2, 50 10, 42 12
      L 18 18
      C 4 22, -10 16, -20 4
      L -40 24
      C -48 32, -60 36, -72 32
      L -82 24
      Z
    " fill="#FFFFFF"/>

    <!-- Right Hand Palm & Thumb (Coming from upper-right) -->
    <path d="
      M 90 -12
      L 45 -38
      C 32 -46, 14 -42, 5 -28
      L -12 -12
      C -20 -4, -22 8, -14 16
      L 24 54
      C 32 62, 44 66, 56 62
      L 72 52
      C 80 44, 84 34, 82 24
      Z
    " fill="#FFFFFF"/>

    <!-- 4 Interlocking Fingers of Right Hand Grasping Left Palm -->
    <!-- Finger 1 (Index) -->
    <path d="
      M 2 -4
      L -24 22
      C -30 28, -30 38, -24 44
      C -18 50, -8 50, -2 44
      L 24 18
      C 30 12, 30 2, 24 -4
      C 18 -10, 8 -10, 2 -4 Z
    " fill="#FFFFFF"/>

    <!-- Finger 2 (Middle) -->
    <path d="
      M 16 10
      L -10 36
      C -16 42, -16 52, -10 58
      C -4 64, 6 64, 12 58
      L 38 32
      C 44 26, 44 16, 38 10
      C 32 4, 22 4, 16 10 Z
    " fill="#FFFFFF"/>

    <!-- Finger 3 (Ring) -->
    <path d="
      M 30 24
      L 4 50
      C -2 56, -2 66, 4 72
      C 10 78, 20 78, 26 72
      L 52 46
      C 58 40, 58 30, 52 24
      C 46 18, 36 18, 30 24 Z
    " fill="#FFFFFF"/>

    <!-- Separation Lines / Cutouts between fingers -->
    <line x1="8" y1="4" x2="-18" y2="30" stroke="${accentStroke}" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="22" y1="18" x2="-4" y2="44" stroke="${accentStroke}" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="-3" y1="-26" x2="22" y2="-1" stroke="${accentStroke}" stroke-width="4.5" stroke-linecap="round"/>
  </g>
  `
}

/**
 * 1. CELENGAN AYAM INDONESIA (Rooster Piggy Bank)
 * Clean modern Indonesian Rooster silhouette with coin slot, coin, and handshake.
 */
export function buildCelenganAyamSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- PRIMARY: Modern Electric Blue #2B7FFF -->
  <!-- ACCENT: Pure White #FFFFFF -->
  <g id="celengan-ayam-nusantara">
    <!-- Coin Slot at the top -->
    <rect x="210" y="112" width="92" height="14" rx="7" fill="#FFFFFF"/>

    <!-- Indonesian Rooster Piggy Bank Body -->
    <path fill="#2B7FFF" fill-rule="evenodd" clip-rule="evenodd" d="
      M 205 136
      C 192 136, 178 140, 166 148
      C 162 130, 150 114, 134 108
      C 118 102, 100 108, 92 122
      C 82 116, 68 118, 58 128
      C 48 138, 46 154, 52 166
      C 40 172, 32 186, 34 202
      C 36 216, 46 226, 58 230
      C 42 238, 30 248, 18 260
      C 34 266, 52 268, 68 266
      C 62 278, 62 292, 70 302
      C 78 312, 92 316, 104 312
      C 110 354, 142 390, 182 406
      L 172 446
      C 170 454, 176 462, 184 462
      L 220 462
      C 228 462, 235 455, 237 447
      L 242 414
      C 251 415, 261 415, 270 414
      L 275 447
      C 277 455, 284 462, 292 462
      L 328 462
      C 336 462, 342 454, 340 446
      L 330 406
      C 370 390, 402 354, 408 312
      C 430 326, 458 324, 476 306
      C 494 286, 498 258, 486 236
      C 498 214, 494 186, 478 166
      C 460 144, 432 138, 408 152
      C 408 128, 394 108, 374 98
      C 352 88, 326 94, 310 112
      C 284 100, 252 98, 222 108
      C 214 114, 208 124, 205 136
      Z
    "/>

    <!-- Tail Plumage Feather Accents in Pure White -->
    <path d="M 408 240 C 438 230, 460 210, 470 178" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.4"/>
    <path d="M 402 280 C 432 272, 454 252, 462 230" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.4"/>

    <!-- Rooster Eye Dot in White -->
    <circle cx="86" cy="210" r="5.5" fill="#FFFFFF"/>

    <!-- Centered Handshake -->
    ${getHandshakePath("#2B7FFF")}
  </g>
</svg>`
}

/**
 * 2. CELENGAN BULAT MINIMALIS (Modern Round Piggy Bank)
 */
export function buildCelenganBulatSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- PRIMARY: Modern Electric Blue #2B7FFF -->
  <!-- ACCENT: Pure White #FFFFFF -->
  <g id="celengan-bulat-modern">
    <!-- Coin Slot at the top -->
    <rect x="210" y="80" width="92" height="15" rx="7.5" fill="#2B7FFF"/>

    <!-- Main Piggy Bank Body Silhouette -->
    <path fill="#2B7FFF" fill-rule="evenodd" clip-rule="evenodd" d="
      M 256 112
      C 334 112, 398 156, 426 218
      C 446 216, 464 228, 470 248
      L 476 266
      C 482 284, 472 304, 454 310
      C 446 312, 438 312, 432 309
      C 412 372, 348 418, 272 418
      C 252 418, 234 414, 216 406
      L 204 448
      C 201 456, 193 462, 184 462
      L 148 462
      C 139 462, 131 454, 133 444
      L 142 402
      C 118 384, 98 360, 86 332
      L 58 344
      C 48 349, 36 344, 31 334
      C 26 324, 31 312, 41 307
      L 66 295
      C 60 276, 56 256, 56 235
      C 56 167, 114 112, 184 112
      C 208 112, 232 112, 256 112
      Z
      M 345 116
      L 378 70
      C 384 60, 398 62, 404 72
      L 416 104
      C 420 114, 414 124, 402 126
      L 366 132
      Z
    "/>

    <!-- Bottom Right Leg -->
    <path d="
      M 306 404
      L 318 448
      C 320 456, 328 462, 337 462
      L 373 462
      C 382 462, 390 456, 388 446
      L 374 400
      Z
    " fill="#2B7FFF"/>

    <!-- Snout Nostril Cutouts -->
    <circle cx="454" cy="256" r="4.5" fill="#FFFFFF" opacity="0.8"/>
    <circle cx="454" cy="272" r="4.5" fill="#FFFFFF" opacity="0.8"/>

    <!-- Piggy Eye Dot -->
    <circle cx="396" cy="195" r="6" fill="#FFFFFF"/>

    <!-- Centered Handshake -->
    ${getHandshakePath("#2B7FFF")}
  </g>
</svg>`
}

/**
 * 3. GEOMETRIC EMBLEM (Ultra-Modern Badge / App Icon)
 * Pure, balanced, iconic design for mobile and web apps.
 */
export function buildEmblemAppIconSVG(variant = "ayam") {
  const isAyam = variant === "ayam"
  const logoSVG = isAyam ? buildCelenganAyamSVG() : buildCelenganBulatSVG()
  const innerContent = logoSVG.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "")

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="appBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090E17"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <radialGradient id="electricHalo" cx="50%" cy="52%" r="50%">
      <stop offset="0%" stop-color="#2B7FFF" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#2B7FFF" stop-opacity="0"/>
    </radialGradient>
    <filter id="iconShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- iOS / Android Squircle Container -->
  <rect width="512" height="512" rx="116" fill="url(#appBgGrad)"/>
  
  <!-- Subtle Glowing Radial Ambient -->
  <circle cx="256" cy="265" r="180" fill="url(#electricHalo)"/>

  <!-- Logo Graphics centered & scaled -->
  <g transform="translate(18, 12) scale(0.93)" filter="url(#iconShadow)">
    ${innerContent}
  </g>
</svg>`
}

async function render() {
  const svgAyam = buildCelenganAyamSVG()
  const svgBulat = buildCelenganBulatSVG()
  const svgAppIconAyam = buildEmblemAppIconSVG("ayam")
  const svgAppIconBulat = buildEmblemAppIconSVG("bulat")

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
    .toFile(path.join(artifactDir, "v2_ayam_512.png"))
  await sharp(Buffer.from(svgBulat))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "v2_bulat_512.png"))
  await sharp(Buffer.from(svgAppIconAyam))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "v2_appicon_ayam_512.png"))
  await sharp(Buffer.from(svgAppIconBulat))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "v2_appicon_bulat_512.png"))

  console.log("Successfully generated v2 SVGs and PNG previews!")
}

render().catch(console.error)
