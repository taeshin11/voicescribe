/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Exclude node-specific ONNX runtime (we use onnxruntime-web in browser)
    config.resolve.alias = {
      ...config.resolve.alias,
      "onnxruntime-node": false,
    };

    // Ignore .node binary files
    config.module.rules.push({
      test: /\.node$/,
      loader: "ignore-loader",
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
};

export default nextConfig;
