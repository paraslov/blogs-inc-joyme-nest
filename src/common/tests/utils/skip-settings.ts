export const skipSettings = {
  run_all_tests: false,

  comments: false,
  likes: true,
  posts: true,
  users: false,
  devices: false,
  blogs_sa: false,
  posts_sa: false,
  blogs_posts_public: false,
  auth_reg_actions: false,
  auth: false,
  auth_refresh: false,

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

export type TestsNames =
  | 'comments'
  | 'likes'
  | 'posts'
  | 'users'
  | 'devices'
  | 'blogs_sa'
  | 'posts_sa'
  | 'blogs_posts_public'
  | 'auth'
  | 'auth_refresh'
  | 'auth_reg_actions'
