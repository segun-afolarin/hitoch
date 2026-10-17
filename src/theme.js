import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00AEEF",
    },
    secondary: {
      main: "#FD933D",
    },
    text: {
      primary: "#404041",
      secondary: "#6F6F73",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
  },

  typography: {
    fontFamily: '"Inter", Arial, sans-serif',

    h1: {
      fontWeight: 700,
      lineHeight: 1.1,
    },

    h2: {
      fontWeight: 700,
      lineHeight: 1.2,
    },

    h3: {
      fontWeight: 600,
    },

    body1: {
      lineHeight: 1.7,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 6,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          paddingLeft: 22,
          paddingRight: 22,
        },
      },
    },

    MuiContainer: {
      defaultProps: {
        maxWidth: "xl",
      },
    },
  },
});

export default theme;