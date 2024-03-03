const urlNeedle = /url\((.+?)\)/;

/*
 *  Collection of functions to  displayed image sources from the page
 *  Covers:
 *  - img: [✔] src
 *  - svg: [✔] href
 *  - div: [✔] background-image, [✔] background, [✔] style
 *  - video: [✔] poster
 *  - canvas: [✔] screenshot
 * */

export type ImageRecords = Record<string, Element[]>;

/**
 * [Utility]
 *
 * Extract URL matches from various style properties.
 * @param element
 * @returns
 */
function getElementStyleMatches(element: HTMLElement): string[] {
  const matches: string[] = [];

  // Match URLs in element's inline style attribute
  const styleMatches = element.getAttribute("style")?.match(urlNeedle);

  if (styleMatches) matches.push(...styleMatches.slice(1));

  // Match URLs in element's background-image property
  const bgMatches = window
    .getComputedStyle(element)
    .backgroundImage.match(urlNeedle);
  if (bgMatches) matches.push(...bgMatches.slice(1));

  // Match URLs in element's :after pseudo-element's background-image property
  const bgAfterMatches = window
    .getComputedStyle(element, ":after")
    .backgroundImage.match(urlNeedle);
  if (bgAfterMatches) matches.push(...bgAfterMatches.slice(1));

  // Match URLs in element's :before pseudo-element's background-image property
  const bgBeforeMatches = window
    .getComputedStyle(element, ":before")
    .backgroundImage.match(urlNeedle);
  if (bgBeforeMatches) matches.push(...bgBeforeMatches.slice(1));

  return matches;
}

/**
 * Extract image sources from img elements
 * @returns An array of unique image srcs
 */
function getDocImageElementsSrcs(): ImageRecords {
  const elements = document.body.querySelectorAll<Element>("img[src]:not([data-img-src])");
  // Get image sources from elements
  const imageSet: ImageRecords = {};

  for (const element of elements) {
    const src = element.getAttribute("src");
    if (src) {
      imageSet[src] ??= [];
      imageSet[src].push(element);
    }
  }

  return imageSet;
}

/**
 * Extract image sources from svg elements
 * @returns
 */
function getDocSvgElementsSrcs(): ImageRecords {
  const elements = document.body.querySelectorAll<HTMLElement>("svg");
  const imageSet: ImageRecords = {};

  // Iterate over each svg element
  for (const element of elements) {
    // Serialize svg data and convert to data URL
    const svgData = new XMLSerializer().serializeToString(element);
    const svgDataBase64 = btoa(unescape(encodeURIComponent(svgData)));
    const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`;
    // Add svg data URL to imageSet
    imageSet[svgDataUrl] ??= [];
    imageSet[svgDataUrl].push(element);
  }

  // Convert set to array and return
  return imageSet;
}

/**
 * Extract image sources from div, span, a, and i elements
 * @returns
 */
function getAttributeElementsSrcs(): ImageRecords {
  const elements = document.body.querySelectorAll<HTMLElement>("div[style]");
  // Get image sources from elements

  const imageSet: ImageRecords = {};

  // Iterate over each element
  for (const element of elements) {
    // Get URL matches from element's styles
    const styleMatches = getElementStyleMatches(element);
    // Add matched URLs to imageSet
    styleMatches.forEach((url) => {
      imageSet[url] ??= [];
      imageSet[url].push(element);
    });
  }

  return imageSet;
}

/**
 * Extract image sources from video elements
 * @returns
 */
function getDocVideoElementsSrcs(): ImageRecords {
  const elements = document.body.querySelectorAll<HTMLElement>("video");
  const imageSet: ImageRecords = {};

  // Iterate over each video element
  for (const element of elements) {
    // Get poster URL from video element
    const posterUrl = element.getAttribute("poster");
    if (posterUrl) {
      imageSet[posterUrl] ??= [];
      imageSet[posterUrl].push(element);
    }
  }

  // Convert set to array and return
  return imageSet;
}

/**
 * Extract image sources from canvas elements
 * @returns
 */
function getDocCanvasElementsSrcs(): ImageRecords {
  const elements = document.body.querySelectorAll<HTMLCanvasElement>("canvas");
  const imageSet: ImageRecords = {};

  // Iterate over each canvas element
  for (const element of elements) {
    // Get screenshot URL from canvas element
    const screenshotUrl = element.toDataURL();
    if (screenshotUrl) {
      imageSet[screenshotUrl] ??= [];
      imageSet[screenshotUrl].push(element);
    }
  }

  return imageSet;
}

const imageTypeNeedle = /^data:image\/(.+?);/;

/**
 * [Utility]
 *
 * See if src has image type
 */
function hasImageType(src: string): boolean {
  return imageTypeNeedle.test(src);
}

/**
 * [Utility]
 *
 * Get image type from src string
 * @param src - A string src
 * @returns The image type
 */
// function getImageType(src: string): string | null {
//   const match = src.match(imageTypeNeedle);
//   if (match) return match[1];
//   return null;
// }

/**
 * [Utility]
 *
 * Is url valid
 * @param url - A string url
 * @returns A boolean
 */
function isValidUrl(urlString: string, strict = false): boolean {
  let url: URL;

  try {
    url = new URL(urlString);
    if (!strict) return true;
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * [Utility]
 *
 * Sort image sources by type
 * @param imageSources - An array of strings srcs
 * @returns The strings sorted by type
 *
 * ? @see https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url#5717133
 */
export function sortImageSourcesByType(
  imageSources: string[]
): Record<string, Set<string>> {
  const sortedSet: Record<string, Set<string>> = {
    image: new Set(),
    url: new Set(),
    string: new Set(),
  };

  for (const imgSrc of imageSources) {
    const imageType = hasImageType(imgSrc);

    if (imageType) {
      sortedSet["image"].add(imgSrc);
    } else if (isValidUrl(imgSrc)) {
      sortedSet["url"].add(imgSrc);
    } else {
      sortedSet["string"].add(imgSrc);
    }
  }

  return sortedSet;
}

/**
 * Extract image sources from document
 * @returns
 */
export function getDocumentImageSources() {
  const images: ImageRecords[] = [
    getDocImageElementsSrcs(),
    getDocSvgElementsSrcs(),
    getAttributeElementsSrcs(),
    getDocVideoElementsSrcs(),
    getDocCanvasElementsSrcs(),
  ];

  return images;
}
