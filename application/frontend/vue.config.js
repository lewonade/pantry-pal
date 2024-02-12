const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack"); // Make sure to import webpack

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      // Define Vue feature flags
      new webpack.DefinePlugin({
        // Ensure these flags are strings; they are replaced as-is in the code
        __VUE_OPTIONS_API__: JSON.stringify(true), // Enable/disable Vue Options API
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false), // Enable/disable Vue Devtools in production
        // Add or adjust flags as necessary for your project
      }),
    ],
  },
});
