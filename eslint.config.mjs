import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import tseslint from 'typescript-eslint';
import boundaries from 'eslint-plugin-boundaries';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tseslint.configs.recommended,
  {
    plugins: {
      boundaries,
    },
  },

  {
    settings: {
      'boundaries/elements': [
        {
          type: 'app',
          pattern: 'src/app/**',
        },
        {
          type: 'domain',
          pattern: 'src/domain/**',
        },
        {
          type: 'application',
          pattern: 'src/application/**',
        },
        {
          type: 'infrastructure',
          pattern: 'src/infrastructure/**',
        },
        {
          type: 'shared',
          pattern: 'src/shared/**',
        },
      ],
    },
  },

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: 'domain',
              allow: ['domain', 'shared'],
            },
            {
              from: 'application',
              allow: ['application', 'domain', 'shared'],
            },
            {
              from: 'infrastructure',
              allow: ['infrastructure', 'domain', 'shared'],
            },
            {
              from: 'app',
              allow: ['app', 'infrastructure', 'application', 'domain', 'shared'],
            },
            {
              from: 'shared',
              allow: ['shared', 'application', 'infrastructure'],
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
