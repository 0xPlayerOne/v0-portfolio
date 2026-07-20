import next from 'eslint-config-next'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...next,
  ...nextCoreWebVitals,
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
    ignores: ['.next/**', 'coverage/**', 'next-env.d.ts', 'public/**'],
  },
]

export default config
