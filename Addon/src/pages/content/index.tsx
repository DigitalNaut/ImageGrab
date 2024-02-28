import { createRoot } from "react-dom/client";

import { ImageHighlightSection } from "./Highlight";

import "./style.css";

const div = document.createElement("div");
div.id = "__root";
document.body.appendChild(div);

const rootContainer = document.querySelector("#__root");
if (!rootContainer) throw new Error("Can't find Options root element");
const root = createRoot(rootContainer);
root.render(<ImageHighlightSection />);

try {
  console.log("Image Grab loaded.");
} catch (e) {
  console.error(e);
}
