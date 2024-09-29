import React, { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { increment } from "./store/counterSlice";
import { RootState } from "./store/store";
import { Link, BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
        <Button className="" onClick={() => dispatch(increment())}>
          count is {count}
        </Button>
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
