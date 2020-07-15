module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  testEnvironment: 'node',
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testTimeout: 10000,
};