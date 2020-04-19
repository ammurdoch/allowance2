module.exports =  {
  env: {
    browser: true,
    jest: true,
    es6: true
  },
  plugins: ["import", "@typescript-eslint", "react-hooks"],
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "no-console": "warn",
    "no-eval": "error",
    "import/first": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/destructuring-assignment": "error",
    "no-shadow": "error",
  },
  overrides: [
    {
      files: ["**/*.js", "**/*.ts", "**/*.tsx"],
      excludedFiles: "node_modules/**",
      rules: {
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}