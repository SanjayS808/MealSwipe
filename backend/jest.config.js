module.exports = {
  // ... other configurations
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text-summary"],
  collectCoverageFrom: ["**/*.js", "!**/*.test.js"], // Example: include all js files in src except test files
  testEnvironment: "node",
  coveragePathIgnorePatterns: [
    "/node_modules/", "/coverage/", "/jest.config.js",
  ]
};