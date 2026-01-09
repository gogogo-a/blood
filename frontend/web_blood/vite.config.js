import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/


// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
       allowedHosts: [
      'owaj94751245.vicp.fun', // 添加允许的主机
      'localhost', // 保留默认的 localhost
      '127.0.0.1', // 保留默认的 127.0.0.1
      "8.140.245.242"
    ],
    host: '0.0.0.0', // 指定主机地址
    port: 8001,        // 指定端口号
  },
})