import { theme } from 'antd';

export const antdTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#667eea',
    colorInfo: '#667eea',
    borderRadius: 8,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  },
  components: {
    Button: {
      borderRadius: 6,
    },
    Card: {
      borderRadius: 12,
    },
    Input: {
      borderRadius: 6,
    },
    Table: {
      borderRadius: 8,
    },
    Menu: {
      borderRadius: 6,
    },
    Tag: {
      borderRadius: 4,
    },
  },
};
