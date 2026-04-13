import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, theme } from "../theme";
import { AppPageLayout } from "./AppPageLayout";
import { routes } from "../routes";

export const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <RouterProvider router={createBrowserRouter([
                {
                    element: <AppPageLayout />,
                    children: [...routes],
                },
            ])} />
        </ThemeProvider>
    );
};