module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  rootDir: __dirname,
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    '^\./(.*)\.(scss|css)$': '<rootDir>/src/styles.css'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@angular|@ngrx|rxjs))'
  ],
  coverageDirectory: '<rootDir>/coverage/portfolio-malbahor',
  coverageReporters: ['html', 'text-summary', 'text'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.d.ts',
    '!src/app/app.config.ts',
    '!src/app/app.config.server.ts'
  ]
};