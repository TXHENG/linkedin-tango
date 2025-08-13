import { createTheme, MenuItem, TextField, useColorScheme } from '@mui/material';
import { type FC, useEffect } from 'react';

export const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

export const ThemeSelector: FC = () => {
  const { mode, setMode } = useColorScheme();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    document.body.className = mode === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : mode!;
  }, [mode]);

  if (!mode) return null;

  return (
    <TextField select value={mode} onChange={(e) => setMode(e.target.value as 'light' | 'dark' | 'system')}>
      <MenuItem value="light">Light</MenuItem>
      <MenuItem value="dark">Dark</MenuItem>
      <MenuItem value="system">System</MenuItem>
    </TextField>
  );
};
