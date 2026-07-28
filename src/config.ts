export const SITE = {
  name: 'SnowViktor',
  nickName: '彬彬',
  url: 'https://snow-viktor.pages.dev',
  lang: 'zh-Hant-TW',
  locale: 'zh-TW',
  description: 'Personal website',
  author: 'SnowViktor',
  robots: 'index, follow',
  twitterCard: 'summary',
} as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/articles/', label: 'Articles' },
  { href: '/projects/', label: 'Projects' },
  {
    href: '/search/',
    label: 'Search',
    icon: 'M10.5 16.5A6 6 0 1 0 10.5 4.5a6 6 0 0 0 0 12zm5.5-.5L21 21',
  },
] as const;

export const SOCIAL_LINKS = [
  {
    href: 'https://github.com/snow-viktor',
    label: 'GitHub',
    path: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z',
  },
  {
    href: 'https://youtube.com/@SnowViktor',
    label: 'YouTube',
    path: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    href: 'https://open.spotify.com/playlist/6UNtYBdzkjM5ESahVu4BT5',
    label: 'Spotify playlist',
    path: 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z',
  },
] as const;

export const QUOTES = [
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci', lang: 'en' },
  { text: 'The best way to predict the future is to invent it.', author: 'Alan Kay', lang: 'en' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck', lang: 'en' },
] as const;