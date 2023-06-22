// eslint-disable-next-line @typescript-eslint/no-var-requires
const {compilerOptions} = require('./tsconfig.json');

function removeSlash(string) {
  return string.replace('/*', '');
}

function convertToBabelAliases(tsConfigPaths) {
  const aliases = {};

  if (!tsConfigPaths) {
    return aliases;
  }

  for (const [key, value] of Object.entries(tsConfigPaths)) {
    if (value.length > 1) {
      throw Error(
        '[Babel.config]: Conversion from multiple path alias not supported',
      );
    }
    aliases[`${removeSlash(key)}`] = `./${removeSlash(value[0])}`;
  }

  return aliases;
}

const babelConfig = {
  sourceMaps: 'inline',
  presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          node: true,
        },
      },
    ],
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.js', '.ts', '.tsx', '.json'],
        alias: convertToBabelAliases(compilerOptions?.paths),
      },
    ],
  ],
};

module.exports = babelConfig;
