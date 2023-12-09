import "./app.css"; // works in mode dev only!

import App from "./App.svelte";
import type { CmsOptions } from "./store/schema";

export * as z from "zod";

export type * as Schema from "./store/schema";
export type AppConfig = ConstructorParameters<typeof App>[0];
export type CmsConfig = AppConfig & CmsOptions;

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

export { App };
