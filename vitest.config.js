import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        test: {
          name: 'backend',
          include: ['server/__tests__/**/*.test.js'],
          environment: 'node'
        }
      },
      {
        plugins: [react()],
        test: {
          name: 'frontend',
          include: ['src/__tests__/**/*.test.{js,jsx}'],
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./src/__tests__/setup.js']
        }
      }
    ]
  }
})
