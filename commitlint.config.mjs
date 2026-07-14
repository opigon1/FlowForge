export default {
  extends: ['@commitlint/config-conventional'],

  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'refactor', 'test', 'docs', 'chore', 'build']],

    'subject-min-length': [2, 'always', 5],

    'subject-max-length': [2, 'always', 72],
  },
};
