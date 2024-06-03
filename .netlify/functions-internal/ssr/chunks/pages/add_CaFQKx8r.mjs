import { c as createAstro, d as createComponent, r as renderTemplate, e as addAttribute, f as renderComponent, g as renderHead, m as maybeRenderHead, h as renderSlot } from '../astro_Dd6veuiG.mjs';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
/* empty css                        */
import { createComponent as createComponent$1, ssr, ssrHydrationKey, escape, ssrAttribute } from 'solid-js/web';
import { createSignal, createEffect, Show } from 'solid-js';

const $$Astro$3 = createAstro("https://www.slumper.me");
const $$ViewTransitions = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$ViewTransitions;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>`;
}, "/home/Mikael/hmnt/files/Personal/slumper/node_modules/astro/components/ViewTransitions.astro", void 0);

const $$Astro$2 = createAstro("https://www.slumper.me");
const $$Head = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Head;
  const { title, favicon = "/public/favicon.svg", description = "Slumper, the exercise randomizer" } = Astro2.props;
  return renderTemplate`<head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml"${addAttribute(favicon, "href")}><link rel="stylesheet" href="/src/styles/slumper.css"><link rel="sitemap" href="/sitemap-index.xml"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderComponent($$result, "ViewTransitions", $$ViewTransitions, {})}${renderHead()}</head>`;
}, "/home/Mikael/hmnt/files/Personal/slumper/src/components/layouts/Head.astro", void 0);

var _tmpl$$1 = ["<figure", ' class="notification"><p>', "</p></figure>"];
function Notification(props) {
  const {
    condition,
    setCondition,
    message,
    duration
  } = props;
  const _duration = duration == null ? 4e3 : duration;
  const [alive, setAlive] = createSignal(false);
  var delay = setTimeout(() => {
    setAlive(false);
    setCondition(false);
  }, _duration);
  createEffect(() => {
    clearTimeout(delay);
    setAlive(condition);
    delay = setTimeout(() => {
      setAlive(false);
      setCondition(false);
    }, _duration);
    return () => clearTimeout(delay);
  });
  return createComponent$1(Show, {
    get when() {
      return alive();
    },
    get children() {
      return ssr(_tmpl$$1, ssrHydrationKey(), escape(message));
    }
  });
}

var _tmpl$ = ["<div", '><a class="link"', "><p>", "</p><img", "></a><!--$-->", "<!--/--></div>"];
function Link(props) {
  const {
    href,
    text,
    src,
    clipboard,
    newtab
  } = props;
  const [copied, setCopied] = createSignal(false);
  return ssr(_tmpl$, ssrHydrationKey() + ssrAttribute("class", clipboard ? "link-container clipboard" : "link-container", false), ssrAttribute("href", clipboard ? escape(null, true) : escape(href, true), false) + ssrAttribute("target", newtab && !clipboard ? "_blank" : "_self", false), escape(text), ssrAttribute("src", escape(src, true), false), escape(createComponent$1(Notification, {
    condition: copied,
    setCondition: setCopied,
    message: "Link copied to clipboard",
    relative: false
  })));
}

const $$Astro$1 = createAstro("https://www.slumper.me");
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description } = Astro2.props;
  return renderTemplate`<html lang="en"> ${renderComponent($$result, "Head", $$Head, { "title": title, "description": description, "favicon": "/src/assets/refresh-negative.svg" })}${maybeRenderHead()}<body> <header> <h1>${title}</h1> </header> ${renderSlot($$result, $$slots["default"])} <footer> ${renderComponent($$result, "Link", Link, { "href": "https://www.embracket.com", "src": "/src/assets/embracketlogo.svg", "text": "Made by Embracket", "newtab": true })} ${renderComponent($$result, "Link", Link, { "href": "https://www.github.com/mikael-ros/slumper", "src": "/src/assets/altdonate.svg", "text": "Donate", "newtab": true })} ${renderComponent($$result, "Link", null, { "href": "https://www.github.com/mikael-ros/slumper", "src": "/src/assets/share.svg", "text": "Share", "clipboard": true, "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "/home/Mikael/hmnt/files/Personal/slumper/src/components/Link.tsx", "client:component-export": "Link" })} ${renderComponent($$result, "Link", Link, { "href": "https://www.github.com/mikael-ros/slumper", "src": "/src/assets/github-mark-white.svg", "text": "GitHub" })} ${renderComponent($$result, "Link", Link, { "href": "https://github.com/mikael-ros/slumper/issues/new", "src": "/src/assets/bug.svg", "text": "Report bug", "newtab": true })} </footer> </body></html>`;
}, "/home/Mikael/hmnt/files/Personal/slumper/src/layouts/Layout.astro", void 0);

const $$Astro = createAstro("https://www.slumper.me");
const $$Add = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Add;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Slumper / Add", "description": "Add your own personal book to Slumper!" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<article> ${renderComponent($$result2, "AddCard", null, { "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "/home/Mikael/hmnt/files/Personal/slumper/src/components/ui/AddCard", "client:component-export": "AddCard" })} </article> ` })}`;
}, "/home/Mikael/hmnt/files/Personal/slumper/src/pages/add.astro", void 0);

const $$file = "/home/Mikael/hmnt/files/Personal/slumper/src/pages/add.astro";
const $$url = "/add";

const add = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Add,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { $$Layout as $, add as a };
