import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ImageCard as Card } from "./GalleryImage";
import {
  ImageCountElm as Count,
  ImageGalleryElm as Gallery,
  ImageHighlightContainerElm as Container,
  ScrollableYElm,
} from "./Elements";
import { singularIf } from "../../util/interface";
import useMutationObservable from "@src/hooks/useMutationObserver";

/**
 * Scans the page for all images and returns their srcs
 * @returns An array of unique image srcs
 */
function getDocImageSrcs() {
  const images = document.body.getElementsByTagName("img");
  const divs = document.body.getElementsByTagName("div");

  const imageSet = new Set<string>();

  let imageCount = 0;
  for (const image of images) {
    const src = image.getAttribute("src");
    if (src) {
      imageSet.add(src);
      imageCount++;
    }
  }

  let divCount = 0;
  let attrCount = 0;
  for (const div of divs) {
    const styleAttr = div.getAttribute("style");

    const styleMatches = styleAttr?.match(/url\((.+?)\)/);
    if (styleMatches) {
      styleMatches.slice(1).forEach((url) => {
        imageSet.add(url);
        divCount++;
      });
      continue;
    }

    const bgMatches = window
      .getComputedStyle(div)
      .backgroundImage.match(/url\("(.+?)"\)/);

    if (bgMatches) {
      bgMatches.slice(1).forEach((url) => {
        imageSet.add(url);
        attrCount++;
      });
    }
  }

  // Log the image total, then the image tags count, then the
  console.log(
    `Found ${imageSet.size} images: ${imageCount} images, ${divCount}/${attrCount} div counts`
  );

  return Array.from(imageSet);
}

export function ImageHighlightSection() {
  const imageIndicator = useRef<HTMLDivElement>(null);
  const [docImages, setDocImages] = useState<null | string[]>();

  useEffect(() => {
    setDocImages(getDocImageSrcs());
  }, []);

  useMutationObservable(document.body, () => {
    setDocImages(getDocImageSrcs());
  });

  if (docImages == null) return <Container>⏳</Container>;

  const { length: imageCount } = docImages;

  if (imageCount === 1 && document.contentType !== "text/html")
    return (
      <Container>
        <span className="text-3xl">🖼</span>
      </Container>
    );

  if (imageCount === 0)
    return (
      <Container rounded>
        <span>📷❓</span>
        <Count>No images</Count>
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
  };

  const handleImageLeave = () => {
    imageIndicator.current?.classList.add("hidden");
  };

  return (
    <Container full>
      {createPortal(
        <div
          ref={imageIndicator}
          className="pointer-events-none absolute z-[9999] hidden animate-ping rounded-sm border-4 border-dashed border-yellow-400 bg-white/10"
        ></div>,
        document.body
      )}
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
        {imageCount > 0 && (
          <>
            Found {imageCount} image{singularIf(imageCount === 1)}
          </>
        )}
        {imageCount === 0 && <>No images found</>}
      </Count>
    </Container>
  );
}
