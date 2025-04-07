const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
    (ext) => ext !== "svg"
  );
defaultConfig.resolver.sourceExts.push("svg");
  
defaultConfig.transformer = {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    resolver: {
        assetExts: defaultConfig.resolver.assetExts,
        sourceExts: defaultConfig.resolver.sourceExts,
    },
    transformer: defaultConfig.transformer,
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
