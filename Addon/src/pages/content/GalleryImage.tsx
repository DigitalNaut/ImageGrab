import { ImageContentType, getImgContentType } from "@src/util/interface";
import { useRef, useState, useEffect } from "react";

const surroundingQuotesNeedle = /^(["']).*?(\1)$/;

/**
 * Image card component for gallery images in the content page
 *
 * Note: The img elements of this component get a data-src attribute that's
 * used for distinguishing these from the host page images so that the gallery
 * doesn't indicate its own images on hover
 *
 * @param param0
 * @returns
 */
export function ImageCard({
  src,
  onHover,
  onLeave,
}: {
  src: string;
  onHover: () => void;
  onLeave: () => void;
}) {
  const [contentType, setContentType] = useState<ImageContentType>();
  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    async function fetchImageInfo() {
      if (!image.current) return;

      setContentType({ type: "loading", size: "loading" });
      const info = await getImgContentType(image.current.src);
      setContentType(info);
    }

    fetchImageInfo();
  }, [image]);

  const { naturalHeight, naturalWidth } = image.current || {};

  return (
    <div
      className="ig-group/card ig-pointer-events-auto ig-flex ig-w-10 ig-min-w-10 ig-cursor-pointer ig-flex-col ig-gap-1 ig-text-clip ig-rounded-sm group-hover/container:ig-w-20 group-hover/container:ig-drop-shadow-sm"
      onMouseEnter={() => image.current && onHover()}
      onMouseLeave={onLeave}
    >
      <div className="ig-group/image ig-relative ig-flex ig-size-10 ig-items-center ig-justify-center ig-overflow-hidden ig-rounded-sm ig-outline ig-outline-1 -ig-outline-offset-1 ig-outline-amber-200 group-hover/container:ig-size-20 group-hover/card:ig-bg-white group-hover/container:ig-outline-0">
        <img
          ref={image}
          src={src.replace(surroundingQuotesNeedle, "")}
          data-img-src={true}
        />

        <div className="ig-absolute ig-right-0 ig-top-0 ig-hidden ig-size-20 ig-flex-col group-hover/image:ig-flex">
          <a
            href={image.current?.src || ""}
            className="ig-group/indicator ig-relative ig-flex ig-size-full ig-flex-1 ig-grow ig-justify-end ig-p-1"
            rel="noopener noreferrer"
            target="_blank"
            title="Open in new tab"
          >
            <span className="ig-size-fit ig-rounded-full ig-bg-slate-900/20 ig-px-1 ig-text-sm ig-text-white group-hover/indicator:ig-bg-slate-900/80">
              👁
            </span>
          </a>
          <a
            className="ig-w-full ig-rounded-b-sm ig-bg-slate-900/20 ig-px-1 ig-py-0.5 ig-text-center ig-text-sm ig-text-white hover:ig-bg-slate-900/80"
            title="Save image"
            href={src}
            download
          >
            Save 💾
          </a>
        </div>
      </div>
      <div className="ig-hidden ig-w-full ig-gap-1 ig-text-clip group-hover/container:ig-block">
        <div className="ig-flex ig-flex-col ig-overflow-hidden ig-rounded-sm ig-bg-white/20 ig-px-1 ig-py-0.5 ig-text-center ig-text-xs ig-text-slate-900 group-hover/card:ig-bg-white">
          <div
            title={`Dimensions ${naturalWidth || "?"}x${naturalHeight || "?"}`}
          >{`${naturalWidth || "?"}x${naturalHeight || "?"}`}</div>
          <div
            className="ig-max-w-full ig-text-ellipsis ig-text-nowrap"
            title={`Type: ${contentType?.type || "unknown"}\n\n${src}`}
          >
            {contentType?.type || "unknown"}
          </div>
          <div title={`Size: ${contentType?.size || "unknown"}`}>
            {contentType?.size != null
              ? `${contentType.size} bytes`
              : "unknown"}
          </div>
        </div>
      </div>
    </div>
  );
}
