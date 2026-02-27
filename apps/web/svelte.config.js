import adapterNode from "@sveltejs/adapter-node";
import adapterVercel from "@sveltejs/adapter-vercel";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // Vercel automatically sets the VERCEL=1 environment variable during deployment.
    // If it's present, we use the Vercel adapter. Otherwise, we default to the Node adapter for Docker/VPS.
    adapter: process.env.VERCEL ? adapterVercel() : adapterNode(),
  },
};

export default config;
