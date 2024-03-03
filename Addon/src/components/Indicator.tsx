import { forwardRef, useRef } from "react";

import { resizeToTarget } from "@src/util/interface";

function useScrollTracking() {
  const trackingFn = useRef<() => void>();

  const stopTracking = () => {
    if (!trackingFn.current) return;

    window.removeEventListener("scroll", trackingFn.current);
    trackingFn.current = undefined;
  };

  const startTracking = (fn: () => void) => {
    if (trackingFn.current) stopTracking();

    trackingFn.current = fn;
    window.addEventListener("scroll", trackingFn.current);
  };

  return {
    startTracking,
    stopTracking,
  };
}

const Indicator = forwardRef<HTMLDivElement, {}>(function Indicator(_, ref) {
  return (
    <div
      ref={ref}
      className="ig-pointer-events-none ig-absolute ig-z-[99999] ig-hidden ig-animate-ping ig-rounded-md ig-border-4 ig-border-dotted ig-border-yellow-400"
    />
  );
});

export function useIndicator() {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const { startTracking, stopTracking } = useScrollTracking();

  const showIndicator = (target: Element, track = true) => {
    if (!indicatorRef.current) return;

    const { current } = indicatorRef;
    current.classList.remove("ig-hidden");
    resizeToTarget(target, current);

    if (track) startTracking(() => resizeToTarget(target, current));
  };

  const hideIndicator = () => {
    indicatorRef.current?.classList.add("ig-hidden");

    stopTracking();
  };

  return {
    Indicator: <Indicator ref={indicatorRef} />,
    showIndicator,
    hideIndicator,
  };
}
