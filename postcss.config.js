const mode = process.env.NODE_ENV;
const dev = mode === "development";
const prodPlugins = dev
  ? {}
  : {
      cssnano: { preset: "default" },
    };

export default {
  plugins: {
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
    ...prodPlugins,
  },
};
