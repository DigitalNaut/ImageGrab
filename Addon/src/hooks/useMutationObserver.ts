import { useEffect, useState } from "react";

type Options = {
  config: MutationObserverInit;
};

const DEFAULT_OPTIONS: Options = {
  config: {
    attributes: true,
    childList: true,
    subtree: true,
  },
};

export default function useMutationObservable(
  targetEl: HTMLElement,
  callback: MutationCallback,
  options = DEFAULT_OPTIONS,
  cb: (ev: "created" | "started" | "disconnected") => void
) {
  const [observer, setObserver] = useState<null | MutationObserver>(null);

  useEffect(() => {
    const obs = new MutationObserver(callback);
    setObserver(obs);

    cb("created");
  }, [callback, cb, options, setObserver]);

  useEffect(() => {
    if (!observer) return;

    const { config } = options;
    observer.observe(targetEl, config);

    cb("started");

    return () => {
      if (!observer) return;
      observer?.disconnect();
      cb("disconnected");
    };
  }, [observer, cb, targetEl, options]);
}
