import { type PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export function ImageCountElm({ children }: PropsWithChildren) {
  return (
    <span className="flex-end flex w-max overflow-ellipsis rounded-full bg-slate-900 px-4 py-2 text-sm text-white">
      {children}
    </span>
  );
}

export function ImageGalleryElm({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-nowrap gap-2 overflow-clip overflow-ellipsis group-hover:flex-wrap">
      {children}
    </div>
  );
}

export function ScrollableYElm({ children }: PropsWithChildren) {
  return (
    <div className="max-h-[30vh] overflow-hidden overflow-y-auto">{children}</div>
  );
}

export function ImageHighlightContainerElm({
  children,
  rounded,
  full,
}: PropsWithChildren<{ rounded?: true; full?: true }>) {
  return (
    <div
      className={twMerge(
        "group fixed bottom-0 left-0 z-[9999] flex w-min max-w-sm flex-col gap-2 rounded-sm bg-amber-200/90 p-2 text-black hover:min-w-fit hover:max-w-full hover:bg-amber-400",
        rounded && "rounded-full px-8 py-4",
        full && "hover:border-t-8 hover:border-amber-200 hover:p-4"
      )}
    >
      {children}
    </div>
  );
}
