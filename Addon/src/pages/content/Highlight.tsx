import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { singularIf } from "@src/util/interface";
import { ImageCard as Card } from "./GalleryImage";
import {
  ImageCountElm as Count,
  ImageGalleryElm as Gallery,
  ImageHighlightContainerElm as Container,
  ScrollableYElm,
} from "./Elements";
import useMutationObservable from "@src/hooks/useMutationObserver";

const urlNeedle = /url\((.+?)\)/;

function getDocImageElementsSrcs() {
  const elements = document.body.querySelectorAll("img[src]");
  const imageSet = new Set<string>();

  for (const element of elements) {
    const src = element.getAttribute("src");
    if (src) imageSet.add(src);
  }

  return Array.from(imageSet);
}

function getDocSvgElementsSrcs() {
  const elements = document.body.querySelectorAll("svg");
  const imageSet = new Set<string>();

  for (const element of elements) {
    const svgData = new XMLSerializer().serializeToString(element);
    const svgDataBase64 = btoa(unescape(encodeURIComponent(svgData)));
    const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`;

    imageSet.add(svgDataUrl);
  }

  return Array.from(imageSet);
}

function getAttributeElementsSrcs() {
  const elements = document.body.querySelectorAll("div, span, a, i");
  const imageSet = new Set<string>();

  for (const element of elements) {
    const styleMatches = element.getAttribute("style")?.match(urlNeedle);
    if (styleMatches) styleMatches.slice(1).forEach((url) => imageSet.add(url));

    const bgMatches = window
      .getComputedStyle(element)
      .backgroundImage.match(urlNeedle);
    if (bgMatches) bgMatches.slice(1).forEach((url) => imageSet.add(url));

    const bgAfterMatches = window
      .getComputedStyle(element, ":after")
      .backgroundImage.match(urlNeedle);
    if (bgAfterMatches)
      bgAfterMatches.slice(1).forEach((url) => imageSet.add(url));

    const bgBeforeMatches = window
      .getComputedStyle(element, ":before")
      .backgroundImage.match(urlNeedle);
    if (bgBeforeMatches)
      bgBeforeMatches.slice(1).forEach((url) => imageSet.add(url));
  }

  return Array.from(imageSet);
}

/**
 * Scans the page for all images and returns their srcs
 * @returns An array of unique image srcs
 */
function getDocImageSrcs() {
  const elements = document.body.querySelectorAll("img, div, span, a, i, svg");

  const imageSet = new Set<string>();

  for (const element of elements) {
    if (element.tagName === "svg") {
      const svgData = new XMLSerializer().serializeToString(element);
      const svgDataBase64 = btoa(unescape(encodeURIComponent(svgData)));
      const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`;

      imageSet.add(svgDataUrl);
      continue;
    }

    const src = element.getAttribute("src");
    if (src) imageSet.add(src);

    const styleMatches = element.getAttribute("style")?.match(urlNeedle);
    if (styleMatches) styleMatches.slice(1).forEach((url) => imageSet.add(url));

    const bgMatches = window
      .getComputedStyle(element)
      .backgroundImage.match(urlNeedle);
    if (bgMatches) bgMatches.slice(1).forEach((url) => imageSet.add(url));

    const bgAfterMatches = window
      .getComputedStyle(element, ":after")
      .backgroundImage.match(urlNeedle);
    if (bgAfterMatches)
      bgAfterMatches.slice(1).forEach((url) => imageSet.add(url));

    const bgBeforeMatches = window
      .getComputedStyle(element, ":before")
      .backgroundImage.match(urlNeedle);
    if (bgBeforeMatches)
      bgBeforeMatches.slice(1).forEach((url) => imageSet.add(url));
  }

  return Array.from(imageSet);
}

export const config = {
  config: {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ["src", "style", "background-image"],
  },
};
export const defaultStats = {
  creations: 0,
  starts: 0,
  disconnects: 0,
};

export function statsReducer(
  state: typeof defaultStats,
  action: "created" | "started" | "disconnected"
) {
  switch (action) {
    case "created":
      return {
        ...state,
        creations: state.creations + 1,
      };
    case "started":
      return {
        ...state,
        starts: state.starts + 1,
      };
    case "disconnected":
      return {
        ...state,
        disconnects: state.disconnects + 1,
      };
  }
}

export function ImageHighlightSection() {
  const imageIndicator = useRef<HTMLDivElement>(null);
  const [docImages, setDocImages] = useState<null | string[]>();
  const [stats, dispatchStats] = useReducer(statsReducer, defaultStats);

  useEffect(() => {
    setDocImages(getDocImageSrcs());
  }, []);

  const callback = useCallback(
    () => setDocImages(getDocImageSrcs()),
    [setDocImages]
  );

  useMutationObservable(document.body, callback, config, dispatchStats);

  if (docImages == null) return <Container>⏳</Container>;

  const { length: imageCount } = docImages;

  if (document.contentType !== "text/html" && imageCount === 1)
    return (
      <Container>
        <span className="text-3xl">🖼</span>
      </Container>
    );

  const handleImageHover = (img: Element) => {
    if (!imageIndicator.current) return;

    const rect = img.getBoundingClientRect();

    imageIndicator.current.style.top = `${rect.top + document.documentElement.scrollTop}px`;
    imageIndicator.current.style.left = `${rect.left + document.documentElement.scrollLeft}px`;
    imageIndicator.current.style.width = `${rect.width}px`;
    imageIndicator.current.style.height = `${rect.height}px`;

    imageIndicator.current.classList.remove("hidden");

    console.log("Hovered", img);
  };

  const handleImageLeave = () => {
    imageIndicator.current?.classList.add("hidden");

    console.log("Left");
  };

  return (
    <Container full>
      {createPortal(
        <div
          ref={imageIndicator}
          className="pointer-events-none absolute z-[9999] hidden animate-ping rounded-md border-4 border-dotted border-yellow-400 bg-white/10"
        ></div>,
        document.body
      )}
      <div>
        <span>Stats</span>
        <ul>
          <li>Creations: {stats.creations}</li>
          <li>Starts: {stats.starts}</li>
          <li>Disconnects: {stats.disconnects}</li>
        </ul>
      </div>
      <ScrollableYElm>
        <Gallery>
          {docImages.map((src) => (
            <Card
              key={src}
              src={src}
              onHover={handleImageHover}
              onLeave={handleImageLeave}
            />
          ))}
        </Gallery>
      </ScrollableYElm>
      <Count>
        {imageCount > 0 ? (
          <>
            Found {imageCount} image{singularIf(imageCount === 1)}
          </>
        ) : (
          <>No images found</>
        )}
      </Count>
    </Container>
  );
}
