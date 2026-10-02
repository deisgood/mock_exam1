import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // PORT 환경변수가 있으면 그것을 쓴다 (같은 앱이 다른 포트로 이미 떠 있는 경우 대비)
  server: { port: Number(process.env.PORT) || 5173 },
})
