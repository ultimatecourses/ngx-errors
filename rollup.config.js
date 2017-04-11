export default {
  entry: 'dist/index.js',
  dest: 'dist/bundle/ultimate.ngerrors.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ngerrors',
  globals: {
    'typescript': 'ts'
  }
};
