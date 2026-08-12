import sanitizeHtmlLib, { type IOptions, type Transformer } from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "div",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "hr",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "s",
  "u",
  "code",
  "span",
  "mark",
  "sub",
  "sup",
  "a",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "colgroup",
  "col",
  "iframe",
];

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  "*": ["style", "class"],
  a: ["href", "target", "rel", "title"],
  img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
  iframe: [
    "src",
    "width",
    "height",
    "allowfullscreen",
    "frameborder",
    "allow",
    "start",
    "autoplay",
    "disablekbcontrols",
    "enableiframeapi",
    "endtime",
    "ivloadpolicy",
    "loop",
    "modestbranding",
    "origin",
    "playlist",
    "rel",
  ],
  th: ["colspan", "rowspan", "scope", "colwidth"],
  td: ["colspan", "rowspan", "scope", "colwidth"],
  table: ["width", "colwidth"],
  col: ["width", "colwidth"],
  div: ["data-youtube-video"],
};

const ALLOWED_SCHEMES = ["http", "https", "mailto", "tel"];

const ALLOWED_SCHEMES_BY_TAG: Record<string, string[]> = {
  img: ["http", "https", "data"],
};

const ALLOWED_IFRAME_HOSTNAMES = [
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "youtu.be",
  "www.youtu.be",
];

const TEXT_ALIGN_VALUES = [/^(?:left|right|center|justify|start|end)$/i];

const COLOR_VALUES = [
  /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,
  /^rgba?\(\s*-?[\d.]+%?\s*,\s*-?[\d.]+%?\s*,\s*-?[\d.]+%?\s*(?:,\s*-?[\d.]+%?\s*)?\)$/i,
  /^hsla?\(\s*-?[\d.]+(?:deg)?\s*,\s*-?[\d.]+%\s*,\s*-?[\d.]+%\s*(?:,\s*-?[\d.]+%?\s*)?\)$/i,
  /^[a-z]+$/i,
];

const LENGTH_VALUES = [
  /^(?:auto|inherit|initial|unset|revert|fit-content|max-content|min-content)$/i,
  /^-?[\d.]+(?:px|pt|pc|em|rem|ex|ch|%|vw|vh|vmin|vmax)$/i,
  /^0$/,
];

const ALLOWED_STYLES: Record<string, Record<string, RegExp[]>> = {
  "*": {
    "text-align": TEXT_ALIGN_VALUES,
    color: COLOR_VALUES,
    "background-color": COLOR_VALUES,
    "min-width": LENGTH_VALUES,
    width: LENGTH_VALUES,
  },
};

const UNSAFE_STYLE_TOKEN = /expression\s*\(|javascript\s*:|url\s*\(/i;

const DATA_IMAGE_URI = /^data:image\/(?:png|jpeg|jpg|gif|webp);base64,[A-Za-z0-9+/=]+$/i;

function stripUrlNoise(value: string): string {
  let cleaned = "";
  for (const ch of value) {
    if (ch.charCodeAt(0) > 32) cleaned += ch;
  }
  return cleaned;
}

function schemeOf(value: string): string | null {
  const matched = stripUrlNoise(value).match(/^([a-zA-Z][a-zA-Z0-9.+-]*):/);
  return matched ? matched[1].toLowerCase() : null;
}

const transformAnyTag: Transformer = (tagName, attribs) => {
  const nextAttribs = { ...attribs };
  if (
    typeof nextAttribs.style === "string" &&
    UNSAFE_STYLE_TOKEN.test(nextAttribs.style)
  ) {
    delete nextAttribs.style;
  }
  return { tagName, attribs: nextAttribs };
};

const transformImgTag: Transformer = (tagName, attribs) => {
  const nextAttribs = { ...attribs };
  const src = nextAttribs.src;
  if (typeof src === "string" && schemeOf(src) === "data") {
    if (!DATA_IMAGE_URI.test(stripUrlNoise(src))) {
      delete nextAttribs.src;
    }
  }
  return { tagName, attribs: nextAttribs };
};

const SANITIZE_OPTIONS: IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: ALLOWED_ATTRIBUTES,
  allowedSchemes: ALLOWED_SCHEMES,
  allowedSchemesByTag: ALLOWED_SCHEMES_BY_TAG,
  allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
  allowProtocolRelative: false,
  allowedIframeHostnames: ALLOWED_IFRAME_HOSTNAMES,
  allowIframeRelativeUrls: false,
  allowedStyles: ALLOWED_STYLES,
  parseStyleAttributes: true,
  transformTags: {
    "*": transformAnyTag,
    img: transformImgTag,
  },
};

export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return sanitizeHtmlLib(html, SANITIZE_OPTIONS);
}
