import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {VantResolver} from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    reactivityTransform:true
  }),
  Components({
    dts:false,
    resolvers:[VantResolver()]
  }),
  createSvgIconsPlugin({
    // 指定图标文件夹，绝对路径（NODE代码）
    iconDirs: [path.resolve(process.cwd(), 'src/icons')]
  })
],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
