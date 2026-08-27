import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['src/**/*.ts'], languageOptions: { globals: { document: 'readonly', window: 'readonly', HTMLElement: 'readonly', HTMLButtonElement: 'readonly', HTMLDialogElement: 'readonly', URL: 'readonly', Event: 'readonly' } } },
);
