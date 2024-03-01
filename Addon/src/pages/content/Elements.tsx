import { type PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export function ImageHighlightContainerElm({
  children,
  rounded,
  full,
}: PropsWithChildren<{ rounded?: true; full?: true }>) {
  return (
    <div
      className={twMerge(
        "group/container fixed bottom-0 right-0 isolate z-[9999] flex max-h-screen w-1/3 flex-col gap-2 rounded-sm bg-amber-400/90 p-2 align-baseline text-black",
        rounded && "rounded-full px-8 py-4",
        full &&
          "border-t-2 border-amber-200 bg-red-300 hover:border-t-4 hover:border-amber-200 hover:px-8"
      )}
    >
      {children}
    </div>
  );
}

export function ImageGalleryElm({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-nowrap gap-2 overflow-hidden group-hover/container:flex-wrap">
      {children}
    </div>
  );
}

export function ScrollableYElm({ children }: PropsWithChildren) {
  return (
    <div className="block overflow-y-auto bg-slate-800/80 shadow-inner drop-shadow-sm">
      {children}
    </div>
  );
}

export function ImageCountElm({ children }: PropsWithChildren) {
  return (
    <span className="flex w-max max-w-full text-ellipsis rounded-full bg-slate-900 px-4 py-2 text-sm text-white">
      {children}
    </span>
  );
}
