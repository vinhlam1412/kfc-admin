import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import tsconfigPaths from "vite-tsconfig-paths"
import eslint from "vite-plugin-eslint"
export default defineConfig(({ mode }) => {
  const env: any = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [react(), eslint(), tsconfigPaths()],
    envPrefix: "APP_",
    base: '/',
    server: {
      port: env.PORT || 3000,
    },
    build: {
      outDir: path.join(__dirname, "build")
    },
  }
})
