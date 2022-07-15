import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve:{
    alias:{
      "@":path.resolve(__dirname,'src')
    },
    css:{
      preprocessorOptions:{
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve("src/assets/css/base.less")}";`,
          },
          javascriptEnabled: true,
        }
      }
    },
  },
  server:{
    proxy:{
      '/api':{
        target:'http://192.168.0.2:1210'
      }
    }
  }
})
