// svgo 2+ dropped the CLI --disable flag; plugins are configured here instead.
// mergePaths and convertPathData stay off so the exported path geometry is
// preserved exactly as drawn.
export default {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          mergePaths: false,
          convertPathData: false,
        },
      },
    },
  ],
};
