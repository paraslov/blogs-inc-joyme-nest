export const skipSettings = {
  run_all_tests: false,

  appTests: true,

  for(testName: TestsNames): boolean {
    // If we need run all tests without skip
    if (this.run_all_tests) {
      return false
    }

    // if test setting exist we need return his setting
    if (typeof this[testName] === 'boolean') {
      return this[testName]
    }

    return false
  },
}

export type TestsNames = 'appTests'
