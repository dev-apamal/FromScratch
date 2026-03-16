// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: [
//       ["babel-preset-expo", { jsxImportSource: "nativewind" }],
//       "nativewind/babel",
//     ],
//   };
// };

module.exports = function (api) {
  api.cache(true);

  const isProduction = process.env.NODE_ENV === "production";

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Strip all console.log/warn/error calls from the production bundle.
      // console.error is kept intentionally so crash-level issues still
      // surface through Sentry's native layer if ever needed.
      ...(isProduction
        ? [["transform-remove-console", { exclude: ["error"] }]]
        : []),
    ],
  };
};
