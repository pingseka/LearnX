/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/app.ts',
    '!src/config/**/*.ts',
    '!src/routes/**/*.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 45,
      branches: 40,
      functions: 45,
      lines: 45
    }
  },
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};