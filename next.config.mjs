import {withSentryConfig} from "@sentry/nextjs";
import webpack from 'webpack';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add transpiler options to handle Supabase packages
  transpilePackages: [
    '@supabase/supabase-js',
    '@supabase/ssr',
    '@supabase/auth-helpers-nextjs',
    '@supabase/storage-js'
  ],
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: "./public/icons" // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        use: ["@svgr/webpack"]
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    // Add Node.js polyfills and provide empty implementations
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "child_process": false,
      "fs": false,
      "net": false,
      "tls": false,
      "os": false,
      "path": false,
      "process": false,
      "buffer": false,
      "util": false,
      "stream": false,
      "crypto": false,
      "querystring": false,
    };

    // Handle node: scheme imports
    config.resolve.alias = {
      ...config.resolve.alias,
      "node:process": false,
      "node:buffer": false,
      "node:util": false,
      "node:stream": false,
      "node:crypto": false,
      "node:querystring": false,
    };

    // Explicitly ignore Node.js specific imports
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^child_process$|^fs$|^net$|^tls$|^os$|^path$|^process$|^buffer$|^util$|^stream$|^crypto$|^querystring$/,
      }),
      new webpack.NormalModuleReplacementPlugin(
        /node:/,
        (resource) => {
          const mod = resource.request.replace(/^node:/, '');
          resource.request = mod;
        }
      ),
      // Fix Supabase Storage module error
      new webpack.DefinePlugin({
        'globalThis.SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL),
        'globalThis.SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      })
    );

    return config;
  },

  images: {
    domains: ["yodlee-1.hs.llnwd.net"], // Add allowed domains for next/image
    dangerouslyAllowSVG: true, // Allow SVGs to be rendered by next/image
    contentSecurityPolicy: "default-src 'self'; img-src 'self' data: https:;", // Add a basic CSP rule
  },
};

export default withSentryConfig(withSentryConfig(nextConfig, {
// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options

org: "finy",
project: "javascript-nextjs",
sentryUrl: "https://sentry.io/",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Automatically annotate React components to show their full name in breadcrumbs and session replay
reactComponentAnnotation: {
enabled: true,
},

// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
tunnelRoute: "/monitoring",

// Hides source maps from generated client bundles
hideSourceMaps: true,

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
}), {
// For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options

org: "finy",
project: "javascript-nextjs",
sentryUrl: "https://sentry.io/",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Automatically annotate React components to show their full name in breadcrumbs and session replay
reactComponentAnnotation: {
enabled: true,
},

// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
tunnelRoute: "/monitoring",

// Hides source maps from generated client bundles
hideSourceMaps: true,

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});