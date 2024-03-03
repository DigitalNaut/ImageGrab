# Extracting displayed image data from HTML elements

For this program, we will be extracting image data from all the HTML elements on the current page that are displaying images.

## Elements that display images

Most elements can display image data via the `background-image`, `background`, and `style` attributes. It may be more useful to find out which elements can't display the image to exclude them.

All the elements that can display image data with a different attribute are listed below:

| Element | Attribute that displays image data |
| --- | --- |
| `img` | `src`, `srcset` |
| `picture` | `href`, `src` |
| `video` | `poster` |
| `canvas` | Screenshot |
| `svg` | Inline SVG |
| `object`* | `data` |
| `embed`* | `src` |

* = Works on Chrome but not on Firefox

| | |
| --- | --- |
| `img` | `div` |
| `a` | `span` |
| `video` | `canvas` |
| `iframe` | `object` |
| `svg` | `embed` |
| `picture` |
| `input` | `label` |
| `select` | `textarea` |

## Attributes that hold images

We'll then need to investigate the unique attributes that hold image data. For example:

| Element | Unique attributes with image data |
| --- | --- |
| `img` | `src`, `srcset` |
| `a` | `href`, `src` |
| `span` | `background-image`, `background`, `style` |
| `div` | `background-image`, `background`, `style` |
| `video` | `poster` |
| `canvas` | `src` |

 
Common attributes:
- `href`, `src`, `background-image`, `background`, `style` |

* = has common attributes

- `img` tags:
  - Unique data location:
    - `src` attribute
    - `srcset` attribute
- `div` tags:
  - Data location:
    - `background-image` attribute
    - `background` attribute
    - `style` attribute
- `a`* tags:
  - Data location:
    - `href` attribute
    - `src` attribute
    - `background-image` attribute
    - `background` attribute
    - `style` attribute
- `span`* tags:
  - Data location:
    - `background-image` attribute
    - `background` attribute
    - `style` attribute
- Common attributes:
  - Data location:
    - `background image` attribute
    - `background` attribute
    - `style` attribute

## Unanswered questions

Questions:
- Does parsing either `background-image` and `background` yield the same results?
- How easily can I retrieve images in embedded tags like \<video>, \<canvas>, \<iframe>, \<object>, \<svg>, \<embed>, \<picture>, \<input>, \<button>, \<label>, \<select>, \<textarea>, \<form>, \<table>, \<th>, \<ul>, \<ol>, \<dl>, \<dt>, \<pre>, \<script>, \<style>, \<code>?
- Can one observe a canvas being rendered?