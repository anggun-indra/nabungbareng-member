import sharp from "sharp"
import fs from "node:fs"
import path from "node:path"

const artifactDir =
  "/Users/nb-mac-fj2n0x/.gemini/antigravity/brain/3c79ec51-9a3e-439b-9cfe-cf814fc4b2b1"

// Precision crafted Handshake Symbol:
// Left hand (from left-top) + Right hand (from right-top) meeting in center
function generateHandshakeSVG() {
  return `
  <!-- HANDSHAKE ICON (White Silhouette with Blue Accent Separation) -->
  <g id="handshake" transform="translate(256, 275) scale(1.15) translate(-256, -275)">
    <!-- Left Arm Sleeve Cuff -->
    <path d="M 140 240 L 175 195 C 178 191, 184 191, 187 195 L 202 207 C 206 210, 206 216, 202 220 L 167 265 C 164 269, 158 269, 154 265 L 140 252 C 136 248, 136 244, 140 240 Z" fill="#FFFFFF"/>
    
    <!-- Right Arm Sleeve Cuff -->
    <path d="M 372 240 L 337 195 C 334 191, 328 191, 325 195 L 310 207 C 306 210, 306 216, 310 220 L 345 265 C 348 269, 354 269, 358 265 L 372 252 C 376 248, 376 244, 372 240 Z" fill="#FFFFFF"/>

    <!-- Left Palm & Thumb clasping over -->
    <!-- Left Hand Base & Thumb -->
    <path d="
      M 185 240 
      L 220 200 
      C 232 188, 252 192, 260 206 
      C 264 213, 274 218, 282 216 
      L 300 212
      C 306 210, 312 214, 313 220
      C 314 226, 310 232, 304 234
      L 282 240
      C 272 243, 262 238, 254 230
      C 248 224, 238 222, 232 228
      L 214 246
      C 208 252, 200 262, 196 274
      L 174 254
      Z
    " fill="#FFFFFF"/>

    <!-- Right Palm & Fingers gripping under -->
    <!-- Main Right Palm Body -->
    <path d="
      M 327 240
      L 292 200
      C 282 190, 266 190, 256 200
      L 242 214
      C 236 220, 236 230, 242 236
      L 268 262
      L 310 266
      C 318 266, 326 260, 330 252
      Z
    " fill="#FFFFFF"/>

    <!-- 4 Interlocking Fingers of Right Hand (angled parallel down-left) -->
    <!-- Finger 1 (Index) -->
    <path d="
      M 248 240
      L 278 270
      C 284 276, 284 286, 278 292
      C 272 298, 262 298, 256 292
      L 226 262
      C 220 256, 220 246, 226 240
      C 232 234, 242 234, 248 240 Z
    " fill="#FFFFFF"/>

    <!-- Finger 2 (Middle) -->
    <path d="
      M 232 256
      L 262 286
      C 268 292, 268 302, 262 308
      C 256 314, 246 314, 240 308
      L 210 278
      C 204 272, 204 262, 210 256
      C 216 250, 226 250, 232 256 Z
    " fill="#FFFFFF"/>

    <!-- Finger 3 (Ring) -->
    <path d="
      M 216 272
      L 246 302
      C 252 308, 252 318, 246 324
      C 240 330, 230 330, 224 324
      L 194 294
      C 188 288, 188 278, 194 272
      C 200 266, 210 266, 216 272 Z
    " fill="#FFFFFF"/>

    <!-- Finger 4 (Pinky) -->
    <path d="
      M 200 288
      L 230 318
      C 236 324, 236 334, 230 340
      C 224 346, 214 346, 208 340
      L 178 310
      C 172 304, 172 294, 178 288
      C 184 282, 194 282, 200 288 Z
    " fill="#FFFFFF"/>

    <!-- Blue crisp gaps between fingers -->
    <line x1="240" y1="248" x2="270" y2="278" stroke="#2B7FFF" stroke-width="4" stroke-linecap="round"/>
    <line x1="224" y1="264" x2="254" y2="294" stroke="#2B7FFF" stroke-width="4" stroke-linecap="round"/>
    <line x1="208" y1="280" x2="238" y2="310" stroke="#2B7FFF" stroke-width="4" stroke-linecap="round"/>
  </g>
  `
}

// 1. CELENGAN AYAM ICON
export function getCelenganAyamSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <g id="celengan-ayam">
    <!-- Top Coin Slot Opening -->
    <rect x="216" y="142" width="80" height="14" rx="7" fill="#FFFFFF" opacity="0.95"/>
    
    <!-- Rooster Piggy Bank Body Silhouette in Electric Blue #2B7FFF -->
    <path fill="#2B7FFF" fill-rule="evenodd" clip-rule="evenodd" d="
      M 220 165
      C 200 165, 182 170, 166 180
      C 160 160, 145 145, 125 145
      C 112 145, 100 152, 92 162
      C 82 158, 70 162, 64 172
      C 58 182, 60 195, 68 202
      C 52 208, 42 222, 42 240
      C 42 258, 54 272, 70 276
      C 68 284, 70 294, 78 300
      C 86 306, 96 306, 104 300
      C 112 345, 145 385, 185 402
      L 175 445
      C 173 454, 180 462, 189 462
      L 225 462
      C 234 462, 241 455, 243 446
      L 248 412
      C 253 413, 259 413, 264 412
      L 269 446
      C 271 455, 278 462, 287 462
      L 323 462
      C 332 462, 339 454, 337 445
      L 327 402
      C 367 385, 400 345, 408 300
      C 426 312, 452 308, 468 290
      C 484 272, 488 246, 478 226
      C 490 204, 486 178, 470 160
      C 454 142, 428 136, 406 148
      C 406 128, 394 110, 376 102
      C 356 94, 334 100, 320 115
      C 292 105, 262 105, 234 115
      C 224 120, 215 127, 208 135
      C 214 144, 218 154, 220 165
      Z
    "/>

    <!-- Subtle Tail Plumage Accents -->
    <path d="M 405 245 C 430 235, 450 215, 460 185" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.35"/>
    <path d="M 400 280 C 425 272, 445 255, 452 235" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.35"/>

    <!-- Integrated Handshake in Center -->
    ${generateHandshakeSVG()}
  </g>
</svg>`
}

// 2. CELENGAN BULAT ICON
export function getCelenganBulatSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <g id="celengan-bulat">
    <!-- Top Coin Slot Opening -->
    <rect x="216" y="86" width="80" height="16" rx="8" fill="#2B7FFF"/>
    
    <!-- Main Round Piggy Bank Body Silhouette in Electric Blue #2B7FFF -->
    <path fill="#2B7FFF" fill-rule="evenodd" clip-rule="evenodd" d="
      M 256 120
      C 328 120, 388 160, 416 218
      C 434 216, 452 228, 458 246
      L 464 264
      C 470 282, 460 300, 442 306
      C 436 308, 430 308, 424 306
      C 406 366, 344 410, 272 410
      C 254 410, 236 406, 220 400
      L 208 440
      C 205 448, 198 454, 189 454
      L 155 454
      C 146 454, 138 446, 140 436
      L 148 396
      C 126 380, 108 358, 96 332
      L 72 344
      C 62 349, 50 344, 45 334
      C 40 324, 45 312, 55 307
      L 78 295
      C 72 278, 68 260, 68 240
      C 68 174, 122 120, 188 120
      C 210 120, 234 120, 256 120
      Z
      M 345 124
      L 375 80
      C 382 70, 396 72, 400 82
      L 412 112
      C 416 122, 410 132, 398 134
      L 365 140
      Z
    "/>

    <!-- Bottom Right Leg -->
    <path d="
      M 308 400
      L 320 440
      C 322 448, 330 454, 339 454
      L 373 454
      C 382 454, 390 448, 388 438
      L 376 396
      Z
    " fill="#2B7FFF"/>

    <!-- Snout Nostril Dots -->
    <circle cx="446" cy="254" r="4" fill="#FFFFFF" opacity="0.6"/>
    <circle cx="446" cy="268" r="4" fill="#FFFFFF" opacity="0.6"/>

    <!-- Integrated Handshake in Center -->
    ${generateHandshakeSVG()}
  </g>
</svg>`
}

// 3. MASTER APP ICON (Square / Squircle Framed for PWA / Mobile / Favicons)
export function getAppIconFramed(type = "ayam") {
  const innerLogo =
    type === "ayam" ? getCelenganAyamSVG() : getCelenganBulatSVG()
  // Strip outer svg tags
  const innerContent = innerLogo
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>/, "")

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="iconBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B1120"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <radialGradient id="electricGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2B7FFF" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#2B7FFF" stop-opacity="0"/>
    </radialGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Squircle Rounded App Container -->
  <rect width="512" height="512" rx="116" fill="url(#iconBgGrad)"/>
  
  <!-- Ambient Electric Blue Glow in center -->
  <circle cx="256" cy="270" r="170" fill="url(#electricGlow)"/>

  <!-- Logo Graphics scaled & centered -->
  <g transform="translate(16, 12) scale(0.94)" filter="url(#cardShadow)">
    ${innerContent}
  </g>
</svg>`
}

async function run() {
  const svgAyam = getCelenganAyamSVG()
  const svgBulat = getCelenganBulatSVG()
  const svgAppIconAyam = getAppIconFramed("ayam")
  const svgAppIconBulat = getAppIconFramed("bulat")

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

  // Convert to PNG previews
  await sharp(Buffer.from(svgAyam))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "preview_ayam_512.png"))
  await sharp(Buffer.from(svgBulat))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "preview_bulat_512.png"))
  await sharp(Buffer.from(svgAppIconAyam))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "preview_appicon_ayam_512.png"))
  await sharp(Buffer.from(svgAppIconBulat))
    .resize(512, 512)
    .png()
    .toFile(path.join(artifactDir, "preview_appicon_bulat_512.png"))

  console.log("Generated all SVGs and PNG previews successfully!")
}

run().catch(console.error)
