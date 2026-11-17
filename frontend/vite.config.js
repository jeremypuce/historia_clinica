const { defineConfig } = require("vite");
const path = require("node:path");

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "historia_clinica";

module.exports = defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? `/${repositoryName}/` : "/",
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        historiaClinica: path.resolve(__dirname, "formulario", "historia-clinica.html")
      }
    }
  }
});
