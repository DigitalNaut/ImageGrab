import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { GalleryImage as Image } from "./GalleryImage";
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
  const imageSet = new Set<string>();

  for (const image of images) {
    if (!image) continue;

    const src = image.getAttribute("src");
    if (src) imageSet.add(src);
  }

  return Array.from(imageSet);
}

export function ImageHighlightSection() {
  const imageIndicator = useRef<HTMLDivElement>(null);
  const [docImages, setDocImages] = useState<null | string[]>();
  const [isReady, setIsReady] = useState(false);

  useMutationObservable(document.body, () => {
    console.log("Mutation observed.");

    if (isReady) setDocImages(getDocImageSrcs());
  });

  useEffect(() => {
    setDocImages(getDocImageSrcs());
    setIsReady(true);
  }, []);

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
          className={`absolute z-[999] hidden animate-pulse rounded-sm border-4 border-dashed border-yellow-400 bg-yellow-400/10 bg-[url(https://github.com/DigitalNaut/ImageGrab/blob/main/Addon/src/assets/img/indicator.png?raw=true)]`}
        ></div>,
        document.body
      )}
      <ScrollableYElm>
        <Gallery>
          {docImages.map((src) => (
            <Image
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
