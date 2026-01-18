import 'react-i18next';
import type { Resources } from './types';

// Extend the i18next module with custom type options
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: Resources;
  }
}