import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { UI_DEV_SERVER_PORT, UI_HOST } from './app_constants.ts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: UI_HOST,
    port: UI_DEV_SERVER_PORT,
    proxy: {
      // '/repos': {
      //   changeOrigin: true,
      //   target: 'http://127.0.0.1:3000' /* setting as "http://localhost:3000" won't work */,
      //   rewrite: path => path.replace('/repos', '/api/v1/repos')
      // }
      '/api/v1': 'http://127.0.0.1:3000'
    }
  }
})
