import { useState, useRef, useCallback, useEffect } from "react";

const defaultTransitionDuration = 400;
const defaultZIndex = 1202;

interface Props {
  transitionDuration?: number;
  // MUI Tooltip is zIndex 1500
  zIndex?: number;
}

/**
 * Generic Headless React Hook to toggle full window for HTML elements.
 *
 * This hook is intended to be used with a HTML Element that accepts a ref.
 * The hook returns a `ref` which should be passed to the HTML Element.
 * This hook also returns a `toggleFullWindow` function which can be used to
 * toggle the full window state of the HTML Element.
 *
 * Additional values returned from the hook include the `isFullWindow` state
 * which is true when the HTML Element is in full window mode, and the
 * `isInTransition` state which is true when the HTML Element is in the
 * transition from full window to non-full window or vice versa.
 *
 * This hooks accepts the following props:
 * - transitionDuration: The duration of the transition from full window to
 *  non-full window. Defaults to 1000ms.
 * - zIndex: The zIndex of the HTML Element. Defaults to 1202.
 *
 * @param props The props to pass to the hook.
 * @returns The `ref`, the `toggleFullScreen` function, the `isFullWindow`
 * state, and the `isInTransition` state.
 * @example
 * const { isFullWindow, ref, toggleFullScreen } = useFullWindow()
 * return (
 *  <div ref={ref}>
 *   <h1>{isFullWindow ? "I am full window" : "I am not full window"}</h1>
 *   <button onClick={toggleFullScreen}>Toggle Full Window</button>
 *  </div>
 * )
 *
 */
export const useFullWindow = <T extends HTMLElement = HTMLDivElement>(
  {
    transitionDuration = defaultTransitionDuration,
    zIndex = defaultZIndex,
  }: Props = {
    transitionDuration: defaultTransitionDuration,
    zIndex: defaultZIndex,
  }
) => {
  const [isFullWindow, setIsFullWindow] = useState(false);
  const [isInTransition, setIsInTransition] = useState(false);
  const [preExistingStyles, setPreExistingStyles] = useState<
    string | undefined
  >(undefined);
  const [preExistingDomRect, setPreExistingDomRect] = useState<
    DOMRect | undefined
  >(undefined);
  const [preExistingBorderRadius, setPreExistingBorderRadius] = useState<
    string | undefined
  >(undefined);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const ref = useRef<T | null>(null);

  const toggleFullWindow = () => {
    setIsFullWindow(!isFullWindow);
  };

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = undefined;
    }
    setIsInTransition(false);
  };

  const listenForEscapeKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (isFullWindow && e.key === "Escape") {
        toggleFullWindow();
      }
    },
    [isFullWindow, toggleFullWindow]
  );

  const addTransition = () => {
    if (ref.current) {
      ref.current.style.transitionDuration = `${transitionDuration}ms`;
      ref.current.style.transitionProperty = "all, transform, height, width";
      ref.current.style.transitionTimingFunction = "ease-in-out";
    }
  };

  const removeTransition = () => {
    if (ref.current) {
      ref.current.style.transitionDuration = `${0}ms`;
      ref.current.style.transitionProperty = "";
      ref.current.style.transitionTimingFunction = "";
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", listenForEscapeKeyPress);
    return () => {
      document.removeEventListener("keydown", listenForEscapeKeyPress);
    };
  }, [listenForEscapeKeyPress]);

  const removeFullWindowStyle = () => {
    clearTimer();
    setIsInTransition(true);
    const { height, width } = preExistingDomRect || {
      height: 0,
      width: 0,
    };
    if (ref.current) {
      ref.current.style.transform = `translate(0px, 0px)`;
      ref.current.style.height = `${height}px`;
      ref.current.style.width = `${width}px`;
      ref.current.style.borderRadius = `${preExistingBorderRadius || "0px"}`;
      timer.current = setTimeout(() => {
        removeTransition();
        setIsInTransition(false);
        if (typeof preExistingStyles !== "undefined" && ref.current) {
          ref.current.style.cssText = preExistingStyles;
        }
        setPreExistingDomRect(undefined);
      }, transitionDuration);
    }
  };

  const attachFullWindowStyle = () => {
    clearTimer();
    setIsInTransition(true);
    const newDomRect = ref.current?.getBoundingClientRect();
    setPreExistingDomRect(newDomRect);
    if (typeof window !== "undefined" && ref.current) {
      setPreExistingBorderRadius(
        window.getComputedStyle(ref.current).borderRadius
      );
    }
    const {
      x: distX,
      y: distY,
      height,
      width,
    } = newDomRect || {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
    };
    if (ref.current) {
      ref.current.style.top = `${distY}px`;
      ref.current.style.left = `${distX}px`;
      ref.current.style.width = `${width}px`;
      ref.current.style.height = `${height}px`;
      ref.current.style.position = "absolute";
      timer.current = setTimeout(() => {
        setIsInTransition(false);
        if (ref.current) {
          addTransition();
          ref.current.style.transform = `translate(-${distX}px, -${distY}px)`;
          ref.current.style.width = "100vw";
          ref.current.style.height = "100vh";
          ref.current.style.borderRadius = "0px";
        }
      });
      ref.current.style.zIndex = zIndex.toString();
    }
  };

  useEffect(() => {
    if (ref.current) {
      if (typeof preExistingStyles === "undefined") {
        // this is true if is the first time using this `ref.current`
        setPreExistingStyles(ref.current.style.cssText);
      }
      if (isFullWindow) {
        attachFullWindowStyle();
      } else {
        if (typeof preExistingDomRect !== "undefined") {
          // this is true if it's not the first time using this `ref.current`
          removeFullWindowStyle();
        }
      }
    } else {
      setPreExistingStyles(undefined);
      setPreExistingBorderRadius(undefined);
      setPreExistingDomRect(undefined);
    }
    return () => {
      clearTimer();
    };
  }, [ref.current, isFullWindow]);

  return { isFullWindow, isInTransition, toggleFullWindow, ref };
};

export default useFullWindow;
