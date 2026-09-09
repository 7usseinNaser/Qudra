export type Theme = 'light' | 'dark'
export interface ThemeContextValue { theme: Theme; toggleTheme: () => void }
export const THEME_STORAGE_KEY = 'qudra-theme'
