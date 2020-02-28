import pluginReference from "./plugin/index";

export default function applyPlugin(config, plugins) {
  const reference = pluginReference;

  let setupPlugins = config.plugins;

  if (plugins) {
    if (!setupPlugins) {
      config.plugins = setupPlugins = [];
    }

    for (let c = 0, length = plugins.length; length--; c++) {
      const config = plugins[c];
      let pluginName = config;
      let options = null;

      if (typeof config !== "string") {
        pluginName = config.name;
        options = config.options || null;
      }

      setupPlugins[c] = reference[pluginName](
        options,
        config
      );
    }
  }

  return config;
}
