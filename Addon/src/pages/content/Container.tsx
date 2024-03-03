import { useCallback, useEffect, useMemo, useState } from "react";

import { scrollIntoView } from "@src/util/interface";
import { ImageCard as Card } from "./GalleryImage";
import {
  ImageCountElm as Count,
  ImageGalleryElm as Gallery,
  ImageHighlightContainerElm as Container,
} from "./Elements";
import useMutationObservable from "@src/hooks/useMutationObserver";
import { type ImageRecords, getDocumentImageSources } from "./src-extraction";
import Toggle from "@src/components/Toggle";
import { useIndicator } from "@src/components/Indicator";

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

type ImageMap = [string, Element[]];

export function MainContainer() {
  const [docImages, setDocImages] = useState<ImageRecords[]>();
  const { Indicator, hideIndicator, showIndicator } = useIndicator();

  useEffect(() => {
    setDocImages(getDocumentImageSources());
  }, []);

  const callback = useCallback(
    () => setDocImages(getDocumentImageSources()),
    [setDocImages]
  );

  useMutationObservable(document.body, callback, config);

  const records: ImageMap[] = useMemo(() => {
    if (!docImages) return [];
    return docImages.reduce((acc, record) => {
      Object.entries(record).forEach((entry) => {
        acc.push(entry);
      });
      return acc;
    }, [] as ImageMap[]);
  }, [docImages]);

  if (docImages == null) return <Container>⏳</Container>;

  const { length: imageCount } = records;

  if (document.contentType !== "text/html" && imageCount === 1)
    return (
      <Container>
        <span className="ig-text-3xl">🖼</span>
      </Container>
    );

  const cardHoverHandler = (elements: ImageMap[1]) => {
    const [firstMatch] = elements;

    if (!firstMatch) return;

    scrollIntoView(firstMatch);
    showIndicator(firstMatch);
  };

  const cardLeaveHandler = () => hideIndicator();

  return (
    <>
      {Indicator}
      <Container full>
        <Gallery>
          {records.map(([src, elements]) => (
            <Card
              key={src}
              src={src}
              onHover={() => cardHoverHandler(elements)}
              onLeave={cardLeaveHandler}
            />
          ))}
        </Gallery>
        <div className="ig-flex ig-items-center ig-gap-2">
          <Count>
            {imageCount > 0 ? (
              <>
                Found {imageCount} image{imageCount > 1 && "s"}
              </>
            ) : (
              <>No images found</>
            )}
          </Count>
          <div className="ig-flex ig-gap-2">
            <Toggle />
            <span>Locate item on hover</span>
          </div>
        </div>
      </Container>
    </>
  );
}
