import { useRef, type RefObject, useState, useEffect } from "react";

/**
 * Extracts the given image's src attribute and returns all elements with the same image src
 * @param target
 * @returns
 */
function matchImagesSrc(target: HTMLImageElement): [string, Element | null] {
  const src = target.getAttribute("data-img-src");

  if (!src || src.length === 0) {
    throw new Error(
      JSON.stringify({
        message: "Image data-img not found for image:",
        target,
      })
    );
  }

  if (src.startsWith("data:image")) return ["image data", null];

  const imgMatch = document.body.querySelector(
    `img[src="${src.replaceAll(/["']/g, "")}"]:not([data-img-src])`
  );

  if (imgMatch) return ["image src", imgMatch];

  const styleMatch = document.body.querySelector(
    src.includes('"')
      ? `[style*='background-image:url(${src})']`
      : src.includes("'")
        ? `[style*="background-image:url(${src})"]`
        : `[style*='background-image:url("${src}")']`
  );

  if (styleMatch) return ["style", styleMatch];

  const elements = Array.from(
    document.body.querySelectorAll("div, span, a, i")
  );

  for (const element of elements) {
    const elementMatch = window.getComputedStyle(element).backgroundImage;
    if (elementMatch.includes(src)) return ["element.computed.src", element];

    const bgAfterMatches = window
      .getComputedStyle(element, ":after")
      .backgroundImage.includes(src);
    if (bgAfterMatches) return ["after", element];
  }

  return ["none found", null];
}

/**
 * Finds all images with the same src and adds the imageMatchStyle class
 */
const cardEnterHandler = (image: RefObject<HTMLImageElement>) => {
  if (!image.current) return;

  const [result, firstMatch] = matchImagesSrc(image.current);

  console.log("Match", result, firstMatch);

  if (!firstMatch) return;

  firstMatch.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });

  return firstMatch;
};

function getImgContentType(
  img: HTMLImageElement
): Promise<{ type: string | null; size: string | null }> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", img.src, true);
    xhr.onreadystatechange = function onFetchDone() {
      if (this.readyState == this.DONE) {
        if (xhr.status == 200) {
          resolve({
            type: xhr.getResponseHeader("Content-Type"), // type
            size: xhr.getResponseHeader("Content-Length"), // size
          });
        } else {
          resolve({ type: "no", size: "info" });
        }
      }
    };
    xhr.onerror = function onFetchError() {
      resolve({ type: "error", size: "fatal" });
    };
    xhr.send();
  });
}

export type ImageInfo = Pick<HTMLImageElement, "src">;

export function ImageCard({
  src,
  onHover,
  onLeave,
}: {
  src: string;
  onHover: (image: Element) => void;
  onLeave: () => void;
}) {
  const [contentType, setContentType] = useState<null | {
    type: string | null;
    size: string | null;
  }>();
  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    async function fetchImageInfo() {
      if (!image.current) return;

      const info = await getImgContentType(image.current);
      setContentType(info);
    }

    setContentType({ type: "loading", size: "loading" });
    fetchImageInfo();
  }, [image]);

  return (
    <div
      className="group/card pointer-events-auto flex w-10 min-w-10 cursor-pointer flex-col gap-1 text-clip rounded-sm group-hover/container:w-20 group-hover/container:drop-shadow-sm"
      onMouseEnter={() => {
        const firstMatch = cardEnterHandler(image);
        console.log(firstMatch);
        if (firstMatch) onHover(firstMatch);
      }}
      onMouseLeave={onLeave}
    >
      <div className="group/image relative flex size-10 items-center justify-center overflow-hidden rounded-sm outline outline-1 -outline-offset-1 outline-amber-200 group-hover/container:size-20 group-hover/card:bg-white group-hover/container:outline-0">
        <img ref={image} src={src.replaceAll(/["']/g, "")} data-img-src={src} />

        <div className="absolute right-0 top-0 hidden size-20 flex-col group-hover/image:flex">
          <a
            href={image.current?.src || ""}
            className="group/indicator relative flex size-full flex-1 grow justify-end p-1"
            rel="noopener noreferrer"
            target="_blank"
            title="Open in new tab"
          >
            <span className="size-fit rounded-full bg-slate-900/20 px-1 text-sm text-white group-hover/indicator:bg-slate-900/80">
              👁
            </span>
          </a>
          <a
            className="w-full rounded-b-sm bg-slate-900/20 px-1 py-0.5 text-center text-sm text-white hover:bg-slate-900/80"
            title="Save image"
            href={src}
            download
          >
            Save 💾
          </a>
        </div>
      </div>
      <div className="hidden w-full gap-1 text-clip group-hover/container:block">
        <div className="flex flex-col overflow-hidden rounded-sm bg-white/20 px-1 py-0.5 text-center text-xs text-slate-900 group-hover/card:bg-white">
          <div
            title={`Dimensions ${image.current?.naturalWidth || "?"}x${image.current?.naturalHeight || "?"}`}
          >{`${image.current?.naturalWidth || "?"}x${image.current?.naturalHeight || "?"}`}</div>
          <div
            className="max-w-full text-ellipsis text-nowrap"
            title={`Type: ${contentType?.type || "unknown"}\n\t${src}`}
          >
            {contentType?.type || "unknown"}
          </div>
          <div title={`Size: ${contentType?.size || "unknown"} bytes`}>
            {contentType?.size || "unknown"} bytes
          </div>
        </div>
      </div>
    </div>
  );
}
