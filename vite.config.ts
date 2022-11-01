import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    basicSsl(),
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: [
          "babel-plugin-macros",
          "@emotion/babel-plugin",
          [
            "@emotion/babel-plugin-jsx-pragmatic",
            {
              export: "jsx",
              import: "__cssprop",
              module: "@emotion/react",
            },
          ],
          [
            "@babel/plugin-transform-react-jsx",
            { pragma: "__cssprop" },
            "twin.macro",
          ],
        ],
      },
    }),
    VitePWA({
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "Memento Coffee",
        short_name: "Memento",
        description: "Memento helps you keep track of everything coffee",
        theme_color: "#e64a19",
        display: "standalone",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "firebase-messaging-sw.ts",
      workbox: {
        globPatterns: [],
        globIgnores: ["*"],
      },
    }),
  ],
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
    },
  },
});
