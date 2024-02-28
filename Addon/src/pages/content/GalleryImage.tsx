import { useRef, type MouseEventHandler } from "react";

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
const imageOverHandler = (img: HTMLImageElement | null) => {
  if (!img) return;

  const matches = matchImagesSrc(img);
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
const imageClickHandler: MouseEventHandler<HTMLImageElement> = (event) => {
  window.open(event.currentTarget.src);
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
        <img
          ref={image}
          src={src}
          data-src={src}
          onMouseLeave={onLeave}
          onClick={imageClickHandler}
        />
        <div className="absolute inset-0 hidden flex-col text-xs group-hover/image:block">
          <button
            className="w-full flex-1 bg-red-500 px-1 py-0.5 text-white"
            onMouseOver={() => {
              const firstMatch = imageOverHandler(image.current);
              if (firstMatch) onHover(firstMatch);
            }}
          >
            <img src="https://github.com/DigitalNaut/ImageGrab/blob/main/Addon/src/assets/img/external-link.svg?raw=true" />
          </button>
          <a
            href={src}
            download={src}
            className="w-full rounded-sm bg-blue-400 px-1 py-0.5 text-center text-slate-900"
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
