import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.test.ts'],
    // Integration tests share one throwaway database; run files one after another.
    fileParallelism: false,
    testTimeout: 120_000,
    hookTimeout: 300_000,
  },
})
