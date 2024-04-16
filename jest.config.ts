module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
  coveragePathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
};
