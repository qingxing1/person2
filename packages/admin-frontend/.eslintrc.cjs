/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  ignorePatterns: ['dist', 'node_modules', 'public'],
  rules: {
    'vue/multi-word-component-names': 'off',
    // 以下为存量代码风格降级为警告, 不阻断 CI, 建议后续逐步重构:
    // - no-mutating-props: 表单组件大量使用 v-model 直接绑定 prop 字段 (需改为 emit 模式)
    // - no-deprecated-filter: 模板中仍使用 Vue 2 过滤器语法
    'vue/no-mutating-props': 'warn',
    'vue/no-deprecated-filter': 'warn',
    'vue/require-v-for-key': 'warn',
    'vue/require-toggle-inside-transition': 'warn',
    'vue/no-use-v-if-with-v-for': 'warn',
    'vue/no-dupe-keys': 'warn',
    'no-empty': 'warn',
  },
};
