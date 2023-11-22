import "./app.css"; // works in mode dev only!

import App from "./App.svelte";
import type { CMSOptions } from "./store/schema";

export * as z from "zod";

type AppConfig = ConstructorParameters<typeof App>[0];
type CmsConfig = AppConfig & CMSOptions;

export default class CMS extends App {
  constructor(cfg: CmsConfig) {
    super({
      $$inline: cfg.$$inline,
      anchor: cfg.anchor,
      context: cfg.context,
      hydrate: cfg.hydrate,
      intro: cfg.intro,
      target: cfg.target,
      props: {
        ...cfg.props,
        backend: cfg.backend,
        collections: cfg.collections,
      },
    });
  }
}

export { App, type AppConfig, type CmsConfig };
