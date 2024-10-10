module.exports = {
  preset: "jest-playwright-test",
  testTimeout: 30000,
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [`<rootDir>/src/setupTests.ts`],
};
