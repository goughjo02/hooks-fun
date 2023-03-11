import React from "react";
import { createRoot } from "react-dom/client";

import "./index.scss";
import UseFullWindowDemo from "./demos/UseFullWindowDemo";

const App = () => (
  <div className="mt-10 text-3xl mx-auto max-w-6xl text-center">
    <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
      Hooks Fun
    </h1>
    <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
      This is a random collection of React hooks that I have written for fun.
      This site was built with <b>Typescript</b>, <b>React</b>, and{" "}
      <b>Tailwind</b>.
    </p>
    <a
      href="#"
      className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
    >
      Source Code
      <svg
        className="w-5 h-5 ml-2 -mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
          clipRule="evenodd"
        ></path>
      </svg>
    </a>
    <hr className="mt-8 mb-8" />
    <h3>Demos</h3>
    <code>useFullWindow</code>
    <UseFullWindowDemo />
  </div>
);

const root = createRoot(document.getElementById("app")!);
root.render(<App />);
