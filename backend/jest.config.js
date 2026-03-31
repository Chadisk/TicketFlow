export default {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/db.js',
  ],
  testMatch: ['**/__tests__/**/*.test.js'],
};
