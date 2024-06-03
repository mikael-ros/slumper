import { c as createAstro, d as createComponent, r as renderTemplate, f as renderComponent, m as maybeRenderHead } from '../astro_Dd6veuiG.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from './add_CaFQKx8r.mjs';

const $$Astro = createAstro("https://www.slumper.me");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Slumper" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<article> ${renderComponent($$result2, "OutputCard", null, { "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "/home/Mikael/hmnt/files/Personal/slumper/src/components/ui/OutputCard", "client:component-export": "OutputCard" })} </article> ${renderComponent($$result2, "VolumeKnob", null, { "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "/home/Mikael/hmnt/files/Personal/slumper/src/components/ui/VolumeKnob", "client:component-export": "VolumeKnob" })} ` })}`;
}, "/home/Mikael/hmnt/files/Personal/slumper/src/pages/index.astro", void 0);

const $$file = "/home/Mikael/hmnt/files/Personal/slumper/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
