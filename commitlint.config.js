export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // В теле коммита допускаются длинные строки (русский текст, ссылки); заголовок по-прежнему короткий.
    'body-max-line-length': [0],
  },
};
