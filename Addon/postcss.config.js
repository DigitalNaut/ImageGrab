const isDev = process.env.NODE_ENV === "development";

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(isDev ? {} : { cssnano: {} }),
  },
};
