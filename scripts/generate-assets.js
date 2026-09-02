import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

async function generateAssets() {
  console.log('Generating PNG icons and screenshots for PWA / Android APK...');

  // SVG for 192x192 icon
  const svg192 = `
  <svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#f43f5e" />
      </linearGradient>
    </defs>
    <rect width="192" height="192" rx="42" fill="url(#grad)" />
    <circle cx="96" cy="96" r="62" fill="#ffffff" />
    <!-- Happy Kid Star / Rocket Mascot -->
    <path d="M96 45 L108 80 L145 80 L115 102 L126 138 L96 116 L66 138 L77 102 L47 80 L84 80 Z" fill="#f59e0b" stroke="#d97706" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="85" cy="95" r="4.5" fill="#1e293b"/>
    <circle cx="107" cy="95" r="4.5" fill="#1e293b"/>
    <path d="M88 108 Q96 116 104 108" fill="none" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="152" cy="40" r="14" fill="#fbbf24"/>
    <circle cx="40" cy="152" r="12" fill="#38bdf8"/>
  </svg>`;

  // SVG for 512x512 icon
  const svg512 = `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad512" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#f43f5e" />
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="112" fill="url(#grad512)" />
    <circle cx="256" cy="256" r="166" fill="#ffffff" />
    <path d="M256 120 L288 214 L386 214 L307 273 L336 368 L256 310 L176 368 L205 273 L126 214 L224 214 Z" fill="#f59e0b" stroke="#d97706" stroke-width="10" stroke-linejoin="round"/>
    <circle cx="225" cy="255" r="12" fill="#1e293b"/>
    <circle cx="287" cy="255" r="12" fill="#1e293b"/>
    <path d="M235 290 Q256 310 277 290" fill="none" stroke="#1e293b" stroke-width="9" stroke-linecap="round"/>
    <circle cx="405" cy="105" r="38" fill="#fbbf24"/>
    <circle cx="105" cy="405" r="32" fill="#38bdf8"/>
  </svg>`;

  // Maskable SVG (safe-zone padding)
  const svgMaskable = `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradMask" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#f43f5e" />
      </linearGradient>
    </defs>
    <rect width="512" height="512" fill="url(#gradMask)" />
    <circle cx="256" cy="256" r="140" fill="#ffffff" />
    <path d="M256 142 L283 220 L365 220 L299 269 L323 349 L256 300 L189 349 L213 269 L147 220 L229 220 Z" fill="#f59e0b" stroke="#d97706" stroke-width="8" stroke-linejoin="round"/>
    <circle cx="230" cy="255" r="10" fill="#1e293b"/>
    <circle cx="282" cy="255" r="10" fill="#1e293b"/>
    <path d="M238 285 Q256 302 274 285" fill="none" stroke="#1e293b" stroke-width="7" stroke-linecap="round"/>
  </svg>`;

  // Mobile Screenshot SVG (540x960)
  const svgMobileScreenshot = `
  <svg width="540" height="960" viewBox="0 0 540 960" xmlns="http://www.w3.org/2000/svg">
    <rect width="540" height="960" fill="#faf8f5"/>
    <rect x="0" y="0" width="540" height="70" fill="#ffffff"/>
    <text x="30" y="45" font-family="sans-serif" font-weight="900" font-size="24" fill="#1e293b">🚀 KiddoLearn</text>
    <rect x="420" y="22" width="90" height="30" rx="15" fill="#fef3c7"/>
    <text x="465" y="42" font-family="sans-serif" font-weight="bold" font-size="14" fill="#92400e" text-anchor="middle">⭐ 15 Stars</text>
    
    <!-- Hero card -->
    <rect x="25" y="90" width="490" height="90" rx="20" fill="#fff1f2"/>
    <text x="50" y="130" font-family="sans-serif" font-weight="900" font-size="20" fill="#9f1239">🔤 Alphabet &amp; Phonics</text>
    <text x="50" y="155" font-family="sans-serif" font-size="13" fill="#be123c">Interactive Touch &amp; Voice Learning for Kids</text>

    <!-- Big card -->
    <rect x="25" y="200" width="490" height="340" rx="24" fill="#ffffff" stroke="#fecdd3" stroke-width="2"/>
    <text x="270" y="320" font-family="sans-serif" font-size="80" text-anchor="middle">🍎</text>
    <text x="270" y="410" font-family="sans-serif" font-weight="900" font-size="64" fill="#e11d48" text-anchor="middle">A a</text>
    <text x="270" y="460" font-family="sans-serif" font-weight="bold" font-size="28" fill="#1e293b" text-anchor="middle">Apple</text>
    <text x="270" y="500" font-family="sans-serif" font-weight="bold" font-size="16" fill="#f59e0b" text-anchor="middle">"A" says /ah/ as in Apple</text>

    <!-- Tile grid -->
    <rect x="25" y="560" width="105" height="110" rx="18" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
    <text x="77" y="615" font-family="sans-serif" font-weight="900" font-size="28" fill="#2563eb" text-anchor="middle">B</text>
    <text x="77" y="645" font-family="sans-serif" font-size="20" text-anchor="middle">🦋</text>

    <rect x="150" y="560" width="105" height="110" rx="18" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
    <text x="202" y="615" font-family="sans-serif" font-weight="900" font-size="28" fill="#d97706" text-anchor="middle">C</text>
    <text x="202" y="645" font-family="sans-serif" font-size="20" text-anchor="middle">🐱</text>

    <rect x="275" y="560" width="105" height="110" rx="18" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="2"/>
    <text x="327" y="615" font-family="sans-serif" font-weight="900" font-size="28" fill="#059669" text-anchor="middle">D</text>
    <text x="327" y="645" font-family="sans-serif" font-size="20" text-anchor="middle">🐬</text>

    <rect x="400" y="560" width="105" height="110" rx="18" fill="#fdf4ff" stroke="#f5d0fe" stroke-width="2"/>
    <text x="452" y="615" font-family="sans-serif" font-weight="900" font-size="28" fill="#9333ea" text-anchor="middle">E</text>
    <text x="452" y="645" font-family="sans-serif" font-size="20" text-anchor="middle">🐘</text>

    <!-- Bottom tab bar -->
    <rect x="0" y="880" width="540" height="80" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <text x="70" y="930" font-family="sans-serif" font-size="14" font-weight="bold" fill="#e11d48" text-anchor="middle">🔤 ABC</text>
    <text x="175" y="930" font-family="sans-serif" font-size="14" font-weight="bold" fill="#64748b" text-anchor="middle">🔢 123</text>
    <text x="270" y="930" font-family="sans-serif" font-size="14" font-weight="bold" fill="#64748b" text-anchor="middle">🎨 Shapes</text>
    <text x="365" y="930" font-family="sans-serif" font-size="14" font-weight="bold" fill="#64748b" text-anchor="middle">✨ Canvas</text>
    <text x="460" y="930" font-family="sans-serif" font-size="14" font-weight="bold" fill="#64748b" text-anchor="middle">⭐ Quiz</text>
  </svg>`;

  // Desktop/Wide Screenshot SVG (1024x576)
  const svgWideScreenshot = `
  <svg width="1024" height="576" viewBox="0 0 1024 576" xmlns="http://www.w3.org/2000/svg">
    <rect width="1024" height="576" fill="#faf8f5"/>
    <rect x="0" y="0" width="1024" height="60" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <text x="40" y="38" font-family="sans-serif" font-weight="900" font-size="22" fill="#1e293b">🚀 KiddoLearn - Kids Interactive Learning App</text>
    
    <!-- Navigation pills -->
    <rect x="360" y="16" width="90" height="30" rx="15" fill="#f43f5e"/>
    <text x="405" y="36" font-family="sans-serif" font-weight="bold" font-size="12" fill="#ffffff" text-anchor="middle">🔤 Phonics</text>
    <rect x="460" y="16" width="90" height="30" rx="15" fill="#f1f5f9"/>
    <text x="505" y="36" font-family="sans-serif" font-weight="bold" font-size="12" fill="#475569" text-anchor="middle">🔢 Numbers</text>
    <rect x="560" y="16" width="90" height="30" rx="15" fill="#f1f5f9"/>
    <text x="605" y="36" font-family="sans-serif" font-weight="bold" font-size="12" fill="#475569" text-anchor="middle">🎨 Shapes</text>
    <rect x="660" y="16" width="90" height="30" rx="15" fill="#f1f5f9"/>
    <text x="705" y="36" font-family="sans-serif" font-weight="bold" font-size="12" fill="#475569" text-anchor="middle">✨ Doodle</text>
    <rect x="760" y="16" width="90" height="30" rx="15" fill="#f1f5f9"/>
    <text x="805" y="36" font-family="sans-serif" font-weight="bold" font-size="12" fill="#475569" text-anchor="middle">⭐ Quiz</text>

    <!-- Cards display -->
    <rect x="40" y="90" width="360" height="440" rx="24" fill="#ffffff" stroke="#fecdd3" stroke-width="2"/>
    <text x="220" y="240" font-family="sans-serif" font-size="90" text-anchor="middle">🍎</text>
    <text x="220" y="340" font-family="sans-serif" font-weight="900" font-size="60" fill="#e11d48" text-anchor="middle">A a</text>
    <text x="220" y="390" font-family="sans-serif" font-weight="bold" font-size="28" fill="#1e293b" text-anchor="middle">Apple</text>
    <rect x="70" y="440" width="300" height="50" rx="16" fill="#f43f5e"/>
    <text x="220" y="472" font-family="sans-serif" font-weight="bold" font-size="15" fill="#ffffff" text-anchor="middle">🔊 Hear Phonics Voice</text>

    <!-- Grid on right -->
    <rect x="430" y="90" width="550" height="440" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
    <text x="460" y="130" font-family="sans-serif" font-weight="bold" font-size="14" fill="#64748b">Touch any letter to explore:</text>
    
    <!-- Row 1 -->
    <rect x="460" y="160" width="85" height="85" rx="16" fill="#fee2e2"/>
    <text x="502" y="200" font-family="sans-serif" font-weight="900" font-size="24" fill="#dc2626" text-anchor="middle">A</text>
    <text x="502" y="225" font-family="sans-serif" font-size="16" text-anchor="middle">🍎</text>

    <rect x="560" y="160" width="85" height="85" rx="16" fill="#dbeafe"/>
    <text x="602" y="200" font-family="sans-serif" font-weight="900" font-size="24" fill="#2563eb" text-anchor="middle">B</text>
    <text x="602" y="225" font-family="sans-serif" font-size="16" text-anchor="middle">🦋</text>

    <rect x="660" y="160" width="85" height="85" rx="16" fill="#fef3c7"/>
    <text x="702" y="200" font-family="sans-serif" font-weight="900" font-size="24" fill="#d97706" text-anchor="middle">C</text>
    <text x="702" y="225" font-family="sans-serif" font-size="16" text-anchor="middle">🐱</text>

    <rect x="760" y="160" width="85" height="85" rx="16" fill="#e0f2fe"/>
    <text x="802" y="200" font-family="sans-serif" font-weight="900" font-size="24" fill="#0284c7" text-anchor="middle">D</text>
    <text x="802" y="225" font-family="sans-serif" font-size="16" text-anchor="middle">🐬</text>

    <rect x="860" y="160" width="85" height="85" rx="16" fill="#d1fae5"/>
    <text x="902" y="200" font-family="sans-serif" font-weight="900" font-size="24" fill="#059669" text-anchor="middle">E</text>
    <text x="902" y="225" font-family="sans-serif" font-size="16" text-anchor="middle">🐘</text>

    <!-- Row 2 -->
    <rect x="460" y="265" width="85" height="85" rx="16" fill="#ecfccb"/>
    <text x="502" y="305" font-family="sans-serif" font-weight="900" font-size="24" fill="#65a30d" text-anchor="middle">F</text>
    <text x="502" y="330" font-family="sans-serif" font-size="16" text-anchor="middle">🐸</text>

    <rect x="560" y="265" width="85" height="85" rx="16" fill="#fef9c3"/>
    <text x="602" y="305" font-family="sans-serif" font-weight="900" font-size="24" fill="#ca8a04" text-anchor="middle">G</text>
    <text x="602" y="330" font-family="sans-serif" font-size="16" text-anchor="middle">🦒</text>

    <rect x="660" y="265" width="85" height="85" rx="16" fill="#fef3c7"/>
    <text x="702" y="305" font-family="sans-serif" font-weight="900" font-size="24" fill="#b45309" text-anchor="middle">H</text>
    <text x="702" y="330" font-family="sans-serif" font-size="16" text-anchor="middle">🐝</text>

    <rect x="760" y="265" width="85" height="85" rx="16" fill="#cffafe"/>
    <text x="802" y="305" font-family="sans-serif" font-weight="900" font-size="24" fill="#0891b2" text-anchor="middle">I</text>
    <text x="802" y="330" font-family="sans-serif" font-size="16" text-anchor="middle">❄️</text>

    <rect x="860" y="265" width="85" height="85" rx="16" fill="#f3e8ff"/>
    <text x="902" y="305" font-family="sans-serif" font-weight="900" font-size="24" fill="#9333ea" text-anchor="middle">J</text>
    <text x="902" y="330" font-family="sans-serif" font-size="16" text-anchor="middle">🪼</text>

    <!-- Bottom prompt -->
    <rect x="460" y="380" width="485" height="110" rx="18" fill="#fffbeb" stroke="#fef08a" stroke-width="1"/>
    <text x="490" y="420" font-family="sans-serif" font-weight="bold" font-size="16" fill="#92400e">⭐ Star Quiz &amp; Counting Safari included</text>
    <text x="490" y="450" font-family="sans-serif" font-size="13" fill="#b45309">Play fun games, collect stars, and learn shapes with real voice feedback.</text>
  </svg>`;

  await sharp(Buffer.from(svg192)).png().toFile(path.join(publicDir, 'icon-192.png'));
  console.log('Created public/icon-192.png');

  await sharp(Buffer.from(svg512)).png().toFile(path.join(publicDir, 'icon-512.png'));
  console.log('Created public/icon-512.png');

  await sharp(Buffer.from(svgMaskable)).png().toFile(path.join(publicDir, 'icon-maskable.png'));
  console.log('Created public/icon-maskable.png');

  await sharp(Buffer.from(svgMobileScreenshot)).png().toFile(path.join(publicDir, 'screenshot-mobile.png'));
  console.log('Created public/screenshot-mobile.png');

  await sharp(Buffer.from(svgWideScreenshot)).png().toFile(path.join(publicDir, 'screenshot-wide.png'));
  console.log('Created public/screenshot-wide.png');

  console.log('All icons and screenshots successfully generated!');
}

generateAssets().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
