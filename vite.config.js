import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, rmSync } from 'fs'

// Plugin to copy static extension assets to dist after build
function chromeExtensionAssets() {
  return {
    name: 'chrome-extension-assets',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist')

      // Move processed popup.html from dist/public/popup.html to dist/popup.html
      try {
        copyFileSync(
          resolve(distDir, 'public/popup.html'),
          resolve(distDir, 'popup.html')
        )
        rmSync(resolve(distDir, 'public'), { recursive: true, force: true })
      } catch {
        // Already at root — skip
      }

      // Copy manifest.json to dist root
      copyFileSync(
        resolve(__dirname, 'manifest.json'),
        resolve(distDir, 'manifest.json')
      )

      // Copy icons if they exist
      try {
        mkdirSync(resolve(distDir, 'icons'), { recursive: true })
        ;['icon16.png', 'icon48.png', 'icon128.png'].forEach((icon) => {
          try {
            copyFileSync(
              resolve(__dirname, `icons/${icon}`),
              resolve(distDir, `icons/${icon}`)
            )
          } catch {
            // Icon file not present — skip
          }
        })
      } catch {
        // icons dir doesn't exist — skip
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), chromeExtensionAssets()],
  // Disable publicDir so Vite doesn't copy public/ as-is (we handle it via rollup entry)
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'public/popup.html'),
        background: resolve(__dirname, 'src/background.js'),
      },
      output: {
        manualChunks: undefined,
        entryFileNames: (chunkInfo) => {
          // Output background.js at dist root without hash
          if (chunkInfo.name === 'background') return 'background.js'
          return 'assets/[name]-[hash].js'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
