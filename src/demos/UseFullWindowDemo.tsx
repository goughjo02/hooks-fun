import clsx from "clsx";

import React from "react";

import { useFullWindow } from "../hooks";

export const UseFullWindowDemo = () => {
  const [transitionDuration, setTransitionDuration] = React.useState(3000);
  const { ref, isFullWindow, isInTransition, toggleFullWindow } = useFullWindow(
    {
      transitionDuration,
    }
  );
  return (
    <div className="flex flex-row justify-center items-center p-8">
      <div
        ref={ref}
        className={clsx({
          "bg-green-500": isFullWindow,
          "bg-red-500": !isFullWindow,
          flex: true,
          "flex-col": true,
          "justify-center": true,
          "items-center": true,
          "p-8": true,
          "rounded-lg": true,
        })}
      >
        <div>
          <label
            htmlFor="transitionDuration"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Transition Duration
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            id="transitionDuration"
            type="number"
            value={transitionDuration}
            onChange={(e) => setTransitionDuration(Number(e.target.value))}
            min={0}
            required
          />
        </div>
        <p className="text-sm text-gray-900 dark:text-white mt-8">
          {isInTransition
            ? "In Transition"
            : isFullWindow
            ? "Full Window"
            : "Not Full Window"}
        </p>
        <button
          className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-yellow-500 rounded-lg border border-gray-200 hover:bg-purple-400 hover:text-gray-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 mt-8 p-4"
          onClick={toggleFullWindow}
        >
          Toggle Full Window
        </button>
      </div>
    </div>
  );
};

export default UseFullWindowDemo;
