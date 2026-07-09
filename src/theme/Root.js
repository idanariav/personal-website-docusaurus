import { ThemeProvider, createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: { main: '#7A5AC8' },
  },
  typography: {
    fontFamily: "'Nunito Sans', sans-serif",
  },
});

export default function Root({ children }) {
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
