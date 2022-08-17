module.exports = function (config) {
  config.set({
    mutator: "javascript",
    packageManager: "npm",

    files: [
      "./**",
      "!.stryker-tmp/**",
      "!node_modules/**",
      "!coverage/**",
      "!test/integration/*.js",
    ],
    mutate: ["controller/**/*.js"],
    testRunner: "jest",
    transpilers: [],
    reporters: ["html", "clear-text", "progress"],
    // reporter: ["html", "clear-text", "progress"],
    coverageAnalysis: "off",
    jest: {
      config: require("./jest.config.js"),
    },
    // logLevel: "all",
    fileLogLevel: "debug",
    thresholds: { high: 95, low: 85, break: 56 },
    timeoutMS: 600 * 1000, // 1 hr
    timeoutFactor: 4,
    maxConcurrentTestRunners: 6,
  });
};
