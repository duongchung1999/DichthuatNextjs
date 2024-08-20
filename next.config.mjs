/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(mp3|wav|ogg)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: `/_next/static/files`,
          outputPath: `${isServer ? '../' : ''}static/files`,
          name: '[name].[ext]',
        },
      },
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    loader: 'custom',
    loaderFile: './my-loader.js',
    
  },
};

// module.exports = nextConfig
export default nextConfig;
