import { useRef, type RefObject } from "react";

/**
 * Extracts the given image's src attribute and returns all images with the same src
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
  const allMatches = document.body.querySelectorAll(`img[src="${src}"]`);
  const matches = Array.from(allMatches).filter((match) => match !== target);

  return matches;
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

export function GalleryImage({
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
    <div className="group/card pointer-events-auto flex w-10 cursor-pointer flex-col gap-1 overflow-clip rounded-sm group-hover:w-20 group-hover:drop-shadow-sm">
      <div className="group/image relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-sm group-hover:h-20 group-hover:w-20 group-hover/card:bg-white">
        <img ref={image} src={src} data-src={src} />
        <div className="absolute inset-0 hidden h-20 w-20 flex-col text-xs group-hover/image:flex">
          <button
            className="relative flex w-full flex-1 grow justify-end px-1 py-0.5 text-white"
            onMouseOver={() => {
              const firstMatch = imageOverHandler(image);
              if (firstMatch) onHover(firstMatch);
            }}
            onMouseLeave={onLeave}
            onClick={() => imageClickHandler(image)}
          >
            <img
              src="https://raw.githubusercontent.com/DigitalNaut/ImageGrab/main/Addon/src/assets/img/external-link.svg"
              width={12}
              height={12}
            />
          </button>
          <a
            href={src}
            download
            className="w-full rounded-sm px-1 py-0.5 text-center text-slate-900"
            rel="noopener noreferrer"
            target="_blank"
            title="Save image"
          >
            Save 💾
          </a>
        </div>
      </div>
      <div className="hidden w-full flex-col gap-1 group-hover:flex">
        <div className="rounded-sm bg-white/20 px-1 py-0.5 text-center text-xs text-slate-900">
          {`${image.current?.naturalWidth || "?"}x${image.current?.naturalHeight || "?"}`}
        </div>
      </div>
    </div>
  );
}
