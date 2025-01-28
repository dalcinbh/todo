// lambda/jest.config.js

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^aws-sdk$': '<rootDir>/__mocks__/aws-sdk.ts',
  },
  setupFiles: ['<rootDir>/tests/setup.ts', '<rootDir>/tests/jest.setup.ts'], // Adicione o setup adicional aqui
};
