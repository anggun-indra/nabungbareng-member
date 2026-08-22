import sharp from "sharp"
import fs from "node:fs"
import path from "node:path"

const outDir =
  "/Users/nb-mac-fj2n0x/.gemini/antigravity/brain/3c79ec51-9a3e-439b-9cfe-cf814fc4b2b1"

// 1. CELENGAN AYAM (Rooster Piggy Bank) + HANDSHAKE
// Electric Blue: #2b7fff, White: #ffffff
const svgCelenganAyam = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- Celengan Ayam (Indonesian Rooster Piggy Bank) Body Silhouette in Electric Blue #2b7fff -->
  <g id="celengan-ayam">
    <!-- Main Rooster & Piggy Bank Silhouette -->
    <path fill="#2b7fff" fill-rule="evenodd" clip-rule="evenodd" d="
      M 195 90 
      C 195 72, 178 58, 160 58 
      C 148 58, 137 65, 132 75 
      C 124 64, 110 58, 96 60 
      C 82 62, 70 72, 66 86 
      C 56 86, 46 93, 43 103 
      C 39 115, 43 128, 52 136 
      C 42 144, 35 156, 36 170 
      C 37 178, 41 185, 46 191
      C 38 193, 30 199, 27 207
      C 22 219, 30 231, 42 234
      C 48 235, 54 233, 59 229
      C 55 240, 56 253, 64 263
      C 69 270, 77 274, 86 274
      C 86 315, 102 352, 130 380
      C 140 390, 152 398, 165 404
      L 155 450
      C 153 458, 159 466, 167 466
      L 205 466
      C 213 466, 220 459, 221 451
      L 228 418
      C 246 422, 266 422, 284 418
      L 291 451
      C 292 459, 299 466, 307 466
      L 345 466
      C 353 466, 359 458, 357 450
      L 347 404
      C 375 390, 397 367, 409 338
      C 425 352, 447 358, 468 350
      C 488 342, 501 323, 502 301
      C 503 277, 490 255, 471 243
      C 484 227, 488 205, 481 185
      C 473 163, 453 148, 430 148
      C 432 135, 428 122, 419 112
      C 406 98, 386 93, 368 99
      C 354 104, 342 115, 336 128
      C 318 108, 293 96, 265 92
      L 265 72
      C 265 65, 259 60, 252 60
      L 220 60
      C 213 60, 207 65, 207 72
      L 207 92
      C 203 91, 199 90, 195 90
      Z
    " />
  </g>
</svg>`

console.log("Testing setup...")
