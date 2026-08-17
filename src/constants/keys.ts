// LocalStorage
export const USER_INFO = 'user_info'
export const AUTH_USER = 'auth_user'
export const ONBOARDING = 'onboarding'

// Onboarding
// Bump this to re-show the how-to-use tour once to everyone who dismissed an
// older version (e.g. after adding a slide worth announcing). Leave it alone
// for copy tweaks — a bump interrupts every returning visitor exactly once.
export const ONBOARDING_VERSION = 1

// Sections
export const SECTIONS = {
  NEWS: 'newsSection',
  EDITORS: 'editorsSection',
  CAT_FACTS: 'catFactsSection',
  STAFF_PICKS: 'staffPicksSection',
  POPULAR: 'popularSection',
  RECOMMENDED: 'recommendedSection',
} as const