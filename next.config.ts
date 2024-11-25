import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { withPayload } from '@payloadcms/next/withPayload'


const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
 

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default withPayload(withMDX(nextConfig));

