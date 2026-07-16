import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn', // or 'off'
      '@typescript-eslint/ban-ts-comment': 'warn',  // or 'off'
      // the plugin was registered but its rules were never enabled (found in M4) —
      // rules-of-hooks violations are real bugs, exhaustive-deps flags stale closures
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    }
  },

  // DTOs must not cross into UI layers — they belong in api/, service/, mappers/, store/.
  // Components, hooks, and pages should consume mapped domain types from @/types/articleTypes.
  // See CLAUDE.md "DTO leakage" rule.
  {
    files: ['src/components/**/*.{ts,tsx}', 'src/hooks/**/*.{ts,tsx}', 'src/pages/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@/types/articleDto', '@/types/articleDto/*'],
          message: 'DTO types must not be imported by components/hooks/pages. Use domain types from @/types/articleTypes — DTOs are mapped at the service/store boundary.',
        }],
      }],
    },
  },

  // Hardcoded color pairs (e.g. text-gray-800 dark:text-slate-100) should use semantic tokens from src/index.css.
  // NewsCard.tsx is excluded — categoryColor() intentionally uses raw Tailwind per-category colors.
  {
    files: ['src/**/*.tsx'],
    ignores: ['src/components/news/cards/NewsCard.tsx'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'Literal[value=/\\bdark:(text|bg|border)-(gray|slate|red|green|amber|yellow|blue|purple|teal|cyan|orange|black|white)/]',
          message: 'Avoid hardcoded color pairs (e.g. text-gray-800 dark:text-slate-100). Use a semantic token from src/index.css (text-primary, bg-elevated, border-border, etc.).',
        },
      ],
    },
  },

  // Hardcoded user-visible strings in JSX should go through useTranslation() / t("KEY").
  // Tests are excluded because they assert against literal strings.
  // Blog posts are excluded because they're long-form prose authored in English (not UI chrome).
  {
    files: ['src/components/**/*.tsx', 'src/pages/**/*.tsx'],
    ignores: ['src/__tests__/**', 'src/blog/posts/**'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'JSXText[value=/[A-Z][a-zA-Z]{3,}/]',
          message: 'Hardcoded user-visible string in JSX. Use useTranslation() and t("KEY") with entries in src/i18n/{en,fr}/common.json.',
        },
      ],
    },
  },
)
