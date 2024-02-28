import { useRef, type RefObject } from "react";

/**
 * Extracts the given image's src attribute and returns all elements with the same image src
 * @param target
 * @returns
 */
const matchImagesSrc = (target: HTMLImageElement) => {
  const src = target.getAttribute("data-src");

  if (src?.length === 0) {
    throw new Error(
      JSON.stringify({
        message: "Image data-img not found for image:",
        target,
      })
    );
  }

  // Find all images with the same src and exclude the given image
  const imgMatches = document.body.querySelectorAll(`img[src="${src}"]`);
  const divStyleMatches = document.body.querySelectorAll(
    `div[style*="background-image:url('${src}')"]`
  );

  console.log(
    `Matched ${imgMatches.length} images and ${divStyleMatches.length} divs. Total: ${imgMatches.length + divStyleMatches.length}`
  );

  const imageMatches = Array.from(imgMatches).filter(
    (match) => match !== target
  );

  const divMatchesArray = Array.from(divStyleMatches).filter(
    (match) => match !== target
  );

  return [...imageMatches, ...divMatchesArray];
};

/**
 * Finds all images with the same src and adds the imageMatchStyle class
 */
const imageOverHandler = (image: RefObject<HTMLImageElement>) => {
  if (!image.current) return;

  const matches = matchImagesSrc(image.current);
  if (matches.length === 0) return;

  const [first] = matches;

  first.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });

  return first;
};

/**
 * Opens the given image's src in a new tab
 */
const imageClickHandler = (image: RefObject<HTMLImageElement>) => {
  if (!image.current) return;

  window.open(image.current.src);
};

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
  const image = useRef<HTMLImageElement>(null);

  return (
    <div
      className="group/card pointer-events-auto flex w-10 cursor-pointer flex-col gap-1 overflow-clip rounded-sm group-hover:w-20 group-hover:drop-shadow-sm"
      onMouseOver={() => {
        const firstMatch = imageOverHandler(image);
        if (firstMatch) onHover(firstMatch);
      }}
      onMouseLeave={onLeave}
    >
      <div className="group/image relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-sm group-hover:h-20 group-hover:w-20 group-hover/card:bg-white">
        <img ref={image} src={src} data-src={src} />

        <div className="absolute right-0 top-0 hidden h-20 w-20 flex-col group-hover/image:flex">
          <button
            className="group/indicator relative flex h-full w-full flex-1 grow justify-end p-1"
            onClick={() => imageClickHandler(image)}
            title="Open in new tab"
          >
            <span className="h-fit w-fit rounded-full bg-slate-900/20 px-1 text-sm text-white group-hover/indicator:bg-slate-900/80">
              👁
            </span>
          </button>
          <a
            className="w-full rounded-sm bg-slate-900/20 px-1 py-0.5 text-center text-sm text-white hover:bg-slate-900/80"
            rel="noopener noreferrer"
            target="_blank"
            title="Save image"
            href={src}
            download
          >
            Save 💾
          </a>
        </div>
      </div>
      <div
        className="hidden w-full flex-col gap-1 overflow-clip group-hover:flex"
        title={src}
      >
        <span className="w-full rounded-sm bg-white/20 px-1 py-0.5 text-center text-xs text-slate-900 group-hover/card:bg-white">
          {`${image.current?.naturalWidth || "?"}x${image.current?.naturalHeight || "?"}`}
        </span>
      </div>
    </div>
  );
}
