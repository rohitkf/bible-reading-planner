// Generates PWA icons from an SVG source using sharp (Next.js internal dep)
import sharp from "sharp";
import { writeFileSync } from "fs";

// SVG source: an open book on dark parchment background with gold accent
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- Background -->
  <rect width="512" height="512" rx="88" fill="#1a1814"/>
  <!-- Open book left page -->
  <path d="M80 156 Q80 136 100 132 L244 126 Q256 124 256 136 L256 376 Q256 388 244 386 L100 380 Q80 376 80 356 Z"
        fill="#2c2920" stroke="#534e42" stroke-width="3"/>
  <!-- Open book right page -->
  <path d="M432 156 Q432 136 412 132 L268 126 Q256 124 256 136 L256 376 Q256 388 268 386 L412 380 Q432 376 432 356 Z"
        fill="#2c2920" stroke="#534e42" stroke-width="3"/>
  <!-- Book spine -->
  <rect x="248" y="124" width="16" height="264" rx="2" fill="#11100c"/>
  <!-- Left page lines -->
  <line x1="108" y1="180" x2="236" y2="180" stroke="#534e42" stroke-width="3" stroke-linecap="round"/>
  <line x1="108" y1="206" x2="236" y2="206" stroke="#534e42" stroke-width="3" stroke-linecap="round"/>
  <line x1="108" y1="232" x2="236" y2="232" stroke="#534e42" stroke-width="3" stroke-linecap="round"/>
  <line x1="108" y1="258" x2="220" y2="258" stroke="#534e42" stroke-width="3" stroke-linecap="round"/>
  <!-- Right page lines -->
  <line x1="276" y1="180" x2="404" y2="180" stroke="#534e42" stroke-width="3" stroke-linecap="round"/>
  <line x1="276" y1="206" x2="404" y2="206" stroke="#534e42" stroke-width="3" stroke-linecap="round"/>
  <line x1="276" y1="232" x2="404" y2="232" stroke="#534e42" stroke-width="3" stroke-linecap="round"/>
  <line x1="276" y1="258" x2="388" y2="258" stroke="#534e42" stroke-width="3" stroke-linecap="round"/>
  <!-- Gold cross on left page -->
  <line x1="172" y1="298" x2="172" y2="358" stroke="#c8963c" stroke-width="6" stroke-linecap="round"/>
  <line x1="148" y1="318" x2="196" y2="318" stroke="#c8963c" stroke-width="6" stroke-linecap="round"/>
  <!-- Gold bookmark ribbon -->
  <polygon points="340,124 365,124 365,200 352,188 340,200" fill="#c8963c"/>
</svg>`;

const sizes = [192, 512];

for (const size of sizes) {
  const buf = await sharp(Buffer.from(svgIcon))
    .resize(size, size)
    .png()
    .toBuffer();
  writeFileSync(`public/icons/icon-${size}.png`, buf);
  console.log(`✓ public/icons/icon-${size}.png`);
}

// Also write a 180px apple-touch-icon
const appleIcon = await sharp(Buffer.from(svgIcon))
  .resize(180, 180)
  .png()
  .toBuffer();
writeFileSync("public/icons/apple-touch-icon.png", appleIcon);
console.log("✓ public/icons/apple-touch-icon.png");

// Favicon (32px)
const favicon = await sharp(Buffer.from(svgIcon))
  .resize(32, 32)
  .png()
  .toBuffer();
writeFileSync("public/favicon.png", favicon);
console.log("✓ public/favicon.png");

console.log("Icons generated successfully.");
