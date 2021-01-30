module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "parserOptions": {
        "sourceType": "module",
        "allowImportExportEverywhere": true,
        "ecmaVersion": 12
    },
    "rules": {
        "semi": ["warn", "always"],
        "quotes": ["warn", "single", { "allowTemplateLiterals": true }]
    },
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "@typescript-eslint"
    ],
};
