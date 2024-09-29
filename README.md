# React Scaffold Project

## Overview

This project is a React scaffold built with **Vite**, **TypeScript**, **Redux Toolkit**, and **Playwright** for testing. The app structure is designed to be used as a base template for future projects with built-in tools and configurations for a smooth developer experience. Below, you'll find the key packages used and how to work with each of them.

## Features

- Vite for fast development
- TypeScript for type safety
- Redux Toolkit for state management
- Tailwind CSS for styling
- Shadcn UI for reusable components
- Jest and Playwright for testing
- ESLint for code linting

## Main Packages

### 1. **Vite**

-   **Purpose:** Vite is a build tool that significantly improves the developer experience by offering faster builds and hot module replacement.
-   **Usage:**
    -   Start the development server: `npm run dev`
    -   Build for production: `npm run build`
    -   Preview production build: `npm run preview`

### 2. **TypeScript**

-   **Purpose:** TypeScript is a typed superset of JavaScript that helps catch errors early and provides enhanced IDE support.
-   **Usage:**
    -   All `.ts` and `.tsx` files use TypeScript. You can define types, interfaces, and use features like generics.
    -   The app has a `tsconfig.json` file to manage TypeScript configurations. Update it to adjust compiler options or include/exclude files.

### 3. **React**

-   **Purpose:** React is a JavaScript library for building user interfaces. This project uses function components, hooks (like `useState`, `useEffect`), and `React Router` for client-side routing.
-   **Usage:**

    -   Define React components in `.tsx` files. Example:

        ```jsx
        function App() {
            return <h1>Hello, React!</h1>;
        }
        ```

    -   Navigate using `Link` from `react-router-dom`:

        ```jsx
        import { Link } from "react-router-dom";
        <Link to="/about">Go to About</Link>;
        ```
### 4. Using Shadcn UI

This project integrates **Shadcn UI** for building highly customizable and accessible components.
- **Usage:**

    -  Installing a new Shadcn UI component:

       ```bash
       npx shadcn add button
       ```

    -  Using the Button Component

       Once Shadcn is installed, you can import and use its components like this:

       ```tsx
       import { Button } from "@/components/ui/button";

       function App() {
         return (
           <div className="App">
             <Button variant="default">Click me</Button>
           </div>
         );
       }
       ```

### 5. **Redux Toolkit**

-   **Purpose:** Redux Toolkit simplifies state management in React applications by providing a standard way to write Redux logic.
-   **Usage:**

    -   Define slices (a collection of reducers and actions) in the `src/store` folder.
    -   Example slice:

        ```ts
        import { createSlice } from "@reduxjs/toolkit";

        const counterSlice = createSlice({
            name: "counter",
            initialState: 0,
            reducers: {
                increment: (state) => state + 1,
                decrement: (state) => state - 1,
            },
        });

        export const { increment, decrement } = counterSlice.actions;
        export default counterSlice.reducer;
        ```

    -   Dispatch actions in your components:

        ```jsx
        const dispatch = useDispatch();
        const handleClick = () => {
            dispatch(increment());
        };
        ```

    -   Access state with `useSelector`:

        ```jsx
        const count = useSelector((state: RootState) => state.counter);
        ```

### 6. **React Router**

-   **Purpose:** React Router provides routing capabilities, enabling navigation between different components.
-   **Usage:**

    -   Define routes using `Routes` and `Route`:

        ```jsx
        import {
            BrowserRouter as Router,
            Routes,
            Route,
        } from "react-router-dom";
        import Home from "./pages/Home";
        import About from "./pages/About";

        function App() {
            return (
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </Router>
            );
        }
        ```

### 7. **Playwright**

-   **Purpose:** Playwright is a framework for end-to-end testing of web apps, allowing you to run automated browser tests.
-   **Usage:**

    -   Write test cases in the `tests` folder.
    -   Example test:

        ```ts
        import { test, expect } from "@playwright/test";

        test("homepage has title", async ({ page }) => {
            await page.goto("http://localhost:5173");
            expect(await page.title()).toBe("Vite App");
        });
        ```

    -   Run tests:

        ```bash
        npx playwright test
        ```

    -   Start the Playwright UI to interact with tests:

        ```bash
        npx playwright show-report
        ```

### 8. **Jest**

-   **Purpose:** Jest is a testing framework used for unit and integration tests, particularly for React components.
-   **Usage:**

    -   Write test files with a `.test.tsx` or `.test.ts` suffix.
    -   Example test for a component:

        ```tsx
        import { render, screen } from "@testing-library/react";
        import App from "./App";

        test("renders the app component", () => {
            render(<App />);
            const linkElement = screen.getByText(/hello world/i);
            expect(linkElement).toBeInTheDocument();
        });
        ```

    -   Run Jest tests:

        ```bash
        npm run test
        ```

### 9. **ESLint**

-   **Purpose:** ESLint helps identify and fix problems in your code, ensuring consistent code quality.
-   **Usage:**

    -   The project uses ESLint with custom rules defined in `.eslintrc.js`.
    -   Run linting on your files:

        ```bash
        npm run lint
        ```

### 10. **Prettier**

-   **Purpose:** Prettier is an opinionated code formatter that ensures your code looks consistent.
-   **Usage:**

    -   Prettier is integrated with ESLint, ensuring code is formatted consistently.
    -   To manually format files:

        ```bash
        npm run format
        ```

## Project Structure

```
src/
├── components/        # Reusable React components
├── pages/             # Individual page components (e.g., Home, About)
├── store/             # Redux slices and store configuration
├── tests/             # Playwright and Jest tests
├── App.tsx            # Main React component
└── index.tsx          # Entry point for React
```

## Scripts

-   **Development:**

    ```bash
    npm run dev
    ```

-   **Build:**

    ```bash
    npm run build
    ```

-   **Test (Playwright):**

    ```bash
    npx playwright test
    ```

-   **Test (Jest):**

    ```bash
    npm run test
    ```

-   **Lint:**

    ```bash
    npm run lint
    ```

-   **Format:**

    ```bash
    npm run format
    ```

## Troubleshooting

-   **Dependency Conflicts:**
    If you encounter dependency resolution errors (e.g., `ERESOLVE`), try running:

    ```bash
    npm install --legacy-peer-deps
    ```

-   **Playwright Setup:**
    Ensure Playwright is correctly set up by running the install command:

    ```bash
    npx playwright install
    ```

-   **Redux DevTools:**
    Make sure to install the [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) in your browser for debugging Redux state.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`

Builds the app for production.

### `npm run lint`

Runs ESLint to analyze and fix code issues.

### `npm test`

Runs unit tests using Jest.

### `npx playwright test`

Runs end-to-end tests using Playwright.

## Conclusion

This scaffold is designed to help you quickly spin up React applications with essential tools such as TypeScript, Redux Toolkit, Playwright for testing, and more. You can now build your features on top of this foundation, ensuring a solid development and testing environment.

### Key Points:

- **Packages**: Each key package (e.g., Vite, TypeScript, Redux, Playwright) is explained with examples of how they are used in the project.
- **Project Structure**: It gives an overview of the folder and file structure of your app.
- **Usage**: It includes examples of common use cases, such as defining routes, writing Redux logic, running tests, and using ESLint and Prettier for code quality.
- **Scripts**: Key npm scripts (`npm run dev`, `npm run test`, `npm run lint`, etc.) are outlined for easy reference.

You can use this `README.md` as a starting template, and adjust or add more details as needed for your project!
```
