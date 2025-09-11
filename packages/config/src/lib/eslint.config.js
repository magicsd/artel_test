export const reactRules = {
  "react/jsx-uses-react": "off",
  "react/react-in-jsx-scope": "off",
  "react/jsx-props-no-spreading": "off",
  "react/require-default-props": "off",
  "react/jsx-filename-extension": [
    "warn",
    {
      extensions: [".tsx", ".jsx"],
    },
  ],
  "react/function-component-definition": [
    "error",
    {
      namedComponents: "arrow-function",
      unnamedComponents: "arrow-function",
    },
  ],
};

export const typescriptRules = {
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    },
  ],
  "@typescript-eslint/consistent-type-imports": [
    "error",
    {
      prefer: "type-imports",
    },
  ],
  "@typescript-eslint/no-explicit-any": "warn",
};

export const importRules = {
  "import/prefer-default-export": "off",
  "import/no-default-export": "error",
  "import/order": [
    "error",
    {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always",
      alphabetize: {
        order: "asc",
        caseInsensitive: true,
      },
    },
  ],
};
