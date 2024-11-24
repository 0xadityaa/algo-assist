import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
 

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default withMDX(nextConfig);

