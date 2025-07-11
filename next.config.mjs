// next.config.mjs
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oazyaakxmlehikwrydgb.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "http",
        hostname: "oazyaakxmlehikwrydgb.supabase.co",
        pathname: "/storage/v1/render/image/sign/**",
      },
      // {
      //   protocol: "https",
      //   hostname: "",
      //   port: "",
      //   pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "",
      //   port: "",
      //   pathname: "/**",
      // },
      // {
      //   protocol: "http",
      //   hostname: "",
      //   port: "",
      //   pathname: "/**",
      // },
    ],
    formats: ["image/avif", "image/webp"],
  },
  webpack: (config) => {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ["@svgr/webpack"],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
