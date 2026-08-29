import { fixupConfigRules } from '@eslint/compat'
import * as espree from 'espree'
import next from 'eslint-config-next'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const nextConfig = fixupConfigRules([...next, ...nextCoreWebVitals])

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...nextConfig,
  {
    // eslint-config-next 16 ships a Babel parser whose scope manager predates
    // ESLint 10's SourceCode contract. Native Espree handles JS and JSX;
    // Next's TypeScript parser remains active for TS files.
    files: ['**/*.{js,cjs,mjs,jsx}'],
    languageOptions: { parser: espree },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@next/next/no-page-custom-font': 'off',
      // react-hooks v7 added this rule; it over-fires on standard idioms
      // (matchMedia init in effect, rAF-throttled scroll spy). Next.js's own
      // config does not enable it. Disabled to avoid false-positive churn.
      'react-hooks/set-state-in-effect': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', 'tests/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['tailwind.config.js'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    ignores: [
      '.next/**',
      '.open-next/**',
      '.wrangler/**',
      'coverage/**',
      'next-env.d.ts',
      'public/**',
    ],
  },
]

export default config
