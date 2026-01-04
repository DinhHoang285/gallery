import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  sassOptions: {
    // Note: @import in additionalData is the recommended way by Next.js
    // The deprecation warning can be ignored as it's handled by Next.js build system
    additionalData: `@import "${path.join(__dirname, 'src/styles/variables.scss')}";`,
  },
};

export default nextConfig;

