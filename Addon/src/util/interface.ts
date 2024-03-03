/**
 * Scrolls an element into view using smooth scrolling
 * @param element The element to scroll into view
 */
export function scrollIntoView(element: Element) {
  if (!element) return;

  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
}

export type ImageContentType = {
  type: string | null;
  size: string | null;
} | null;

/**
 * Fetches image content type from server with a HEAD request
 * @param src The image source url
 * @returns The image content type from the header
 */
export function getImgContentType(src: string): Promise<ImageContentType> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", src, true);
    xhr.onreadystatechange = function onFetchDone() {
      if (this.readyState == this.DONE) {
        if (xhr.status == 200) {
          resolve({
            type: xhr.getResponseHeader("Content-Type"), // type
            size: xhr.getResponseHeader("Content-Length"), // size
          });
        } else {
          resolve({ type: null, size: null });
        }
      }
    };
    xhr.onerror = function onFetchError() {
      resolve({ type: null, size: null });
    };
    xhr.send();
  });
}

/**
 * Resizes an element to the dimensions of another
 * @param from Target element
 * @param to Element to resize
 */
export function resizeToTarget(from: Element, to: HTMLDivElement) {
  const rect = from.getBoundingClientRect();

  to.style.top = `${rect.top + document.documentElement.scrollTop}px`;
  to.style.left = `${rect.left + document.documentElement.scrollLeft}px`;
  to.style.width = `${rect.width}px`;
  to.style.height = `${rect.height}px`;
}
