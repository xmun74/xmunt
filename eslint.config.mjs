import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@next/next/no-page-custom-font': 'off',
      'no-console': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'import/prefer-default-export': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'cache/**',
  ]),
])

export default eslintConfig
