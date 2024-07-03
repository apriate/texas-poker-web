import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// elementPlus按需导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 配置插件
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  // 配置别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    open: true,
    port: 5173,
    host: '0.0.0.0'
  },

  css: {
    // 预处理器配置项
    preprocessorOptions: {
      less: {
        // additionalData: `@import "@/styles/variables.less";`,
        math: 'always'
      }
    }
  }
})
