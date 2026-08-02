const fs = require('fs');
const path = require('path');

const srcPath = 'C:\\Users\\PC2301.HOME-OFFICE\\.gemini\\antigravity-ide\\brain\\ccb8a45f-bb90-4b21-b12f-c0882dd9c690\\step5_home_alert_active_verified_1785566811253.png';
const destDir = path.join(__dirname, 'public');
const destPath = path.join(destDir, 'app-screenshot.png');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

try {
  fs.copyFileSync(srcPath, destPath);
  console.log('✅ Screenshot copied successfully to public/app-screenshot.png');
} catch (e) {
  console.error('Failed to copy screenshot:', e.message);
}
