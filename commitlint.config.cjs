/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Enforce conventional commit types relevant to this project
    "type-enum": [
      2,
      "always",
      [
        "feat", // new feature
        "fix", // bug fix
        "docs", // documentation only
        "style", // formatting, no logic change
        "refactor", // code change that neither fixes a bug nor adds a feature
        "perf", // performance improvement
        "test", // adding or updating tests
        "build", // build system or dependency changes
        "ci", // CI/CD configuration changes
        "chore", // other changes (e.g. release, tooling)
        "revert", // revert a previous commit
      ],
    ],
    "subject-case": [2, "always", "lower-case"],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 100],
    "body-leading-blank": [1, "always"],
    "footer-leading-blank": [1, "always"],
  },
};
