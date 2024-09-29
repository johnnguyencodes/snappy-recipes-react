import React, { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "./store/counterSlice";
import { RootState } from "./store/store";
import { Link, BrowserRouter as Router, Route, Routes } from "react-router-dom";

const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));

function App() {
  const dispatch = useDispatch();
  const count = useSelector((state: RootState) => state.counter);

  const message: string = "Hello, Typescript!";
  return (
    <>
      <Router>
        <h1 className="text-9xl font-bold text-lightmode-blue underline">
          Hello world! {message}
        </h1>
        <button
          className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => dispatch(increment())}
        >
          count is {count}
        </button>
        <Link className="text-6xl text-black hover:text-gray-200" to="/">
          Home
        </Link>
        <Link className="text-6xl text-black hover:text-gray-200" to="/about">
          About
        </Link>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
