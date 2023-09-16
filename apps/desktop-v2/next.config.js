/** @type {import('next').NextConfig} */
const nextConfig = {
    output: process.env.ENV==="desktop" ? "export" : "standalone",
    transpilePackages: ["@supernova/api-client"],
}

module.exports = nextConfig
