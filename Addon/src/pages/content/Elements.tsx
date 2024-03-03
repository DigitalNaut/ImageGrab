import { type PropsWithRef, type PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export function ImageHighlightContainerElm({
  children,
  rounded,
  full,
}: PropsWithChildren<PropsWithRef<{ rounded?: true; full?: true }>>) {
  return (
    <div
      className={twMerge(
        "ig-group/container ig-fixed ig-bottom-0 ig-left-0 ig-isolate ig-z-[9999] ig-flex ig-max-h-screen ig-w-full ig-max-w-[100vw] ig-flex-col ig-gap-2 ig-rounded-sm ig-bg-amber-400/90 ig-p-2 ig-align-baseline ig-text-black",
        rounded && "rounded-full px-8 py-4",
        full &&
          "ig-border-t-2 ig-border-amber-200 ig-bg-yellow-300 hover:ig-border-t-4 hover:ig-border-amber-200"
      )}
    >
      {children}
    </div>
  );
}

export function ImageGalleryElm({ children }: PropsWithChildren) {
  return (
    <div
      className="ig-flex ig-max-h-[30vh] ig-w-full ig-flex-nowrap ig-gap-2 ig-overflow-hidden ig-overflow-y-auto ig-bg-slate-800/80 ig-shadow-inner 
  ig-drop-shadow-sm group-hover/container:ig-flex-wrap"
    >
      {children}
    </div>
  );
}

export function ImageCountElm({ children }: PropsWithChildren) {
  return (
    <span className="ig-flex ig-w-max ig-max-w-full ig-text-ellipsis ig-rounded-full ig-bg-slate-900/20 ig-px-4 ig-py-2 ig-text-sm ig-text-white">
      {children}
    </span>
  );
}
