const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tự động update version SW mỗi lần build
  webpack(config, { buildId, isServer }) {
    if (!isServer) {
      // Inject BUILD_TIME vào sw.js sau khi copy sang public
      const swPath = path.join(__dirname, 'public', 'sw.js')
      let sw = fs.readFileSync(swPath, 'utf-8')
      const version = `epl-${buildId.slice(0, 8)}`
      sw = sw.replace('epl-v__BUILD_TIME__', version)
      // Ghi vào .next/static để Vercel serve
      const outDir = path.join(__dirname, '.next', 'static')
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
      // Không ghi đè public/sw.js — chỉ patch lúc runtime
    }
    return config
  },
}

module.exports = nextConfig
