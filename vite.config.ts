import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		host: 'localhost',
		// host: "localhost", // or '0.0.0.0' if you want LAN access
		port: 5174, // port
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"), // now @ points to /src
		},
	},
	base: "/"
});
