export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'chore',
        'refactor',
        'test',
        'style',
        'perf',
        'build',
        'ci',
      ],
    ],
  },
  ignores: [(message) => /^(fixup!|squash!)/.test(message)],
};
