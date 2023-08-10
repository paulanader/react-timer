/* eslint-disable prettier/prettier */
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/themes/default";
import { GlobalStyle } from "./styles/global";
import { Router } from "./Router";
import { CycleProvider } from "./hooks/CyrcleProvider";

export const App = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CycleProvider>
        <GlobalStyle />
        <Router />
      </CycleProvider>
    </ThemeProvider>
  );
};
