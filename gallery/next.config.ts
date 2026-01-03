import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `@import "${path.join(__dirname, 'src/styles/variables.scss')}";`,
  },
};

export default nextConfig;
