module.exports = {
    infrastructureLogging: {
      level: 'error',
    },
    stats: {
      warnings: false,
      warningsFilter: [
        /webpack\.cache\.PackFileCacheStrategy/,
        /Serializing big strings/,
        /deserialization performance/,
        /consider using Buffer/
      ]
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    ignoreWarnings: [
      /webpack\.cache\.PackFileCacheStrategy/,
      /Serializing big strings/,
      /impacts deserialization performance/
    ]
  };