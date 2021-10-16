const { build } = require('esbuild')
const platformSuffixPlugin = require('./plugins/NativeClassDecoratorPlugin');

build({
  entryPoints: ['./src/app.ts'],
  outfile: './out.js',
  minify: true,
  bundle: true,
  plugins: [platformSuffixPlugin]
}).catch(() => process.exit(1))