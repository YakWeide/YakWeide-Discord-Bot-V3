const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    files: ["src/**/*.js", "test/**/*.js", "eslint.config.js"],
    languageOptions: {
      globals: {
        console: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly",
      },
    },
    rules: {
      curly: "error",
      eqeqeq: "error",
      "no-implicit-coercion": "error",
    },
  },
];
