import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.1.53',
    port: 5000, // Puedes cambiar el puerto si es necesario
  },
})
