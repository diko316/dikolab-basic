import pluginNodeResolve from './node-resolve.plugin';
import pluginCommonjs from './commonjs.plugin';
import pluginBabel from './babel.plugin';
import pluginTerser from './terser.plugin';


const PLUGIN_REFERENCE = {
  'node-resolve': pluginNodeResolve,
  'commonjs': pluginCommonjs,
  'babel': pluginBabel,
  'terser': pluginTerser
};

export default function applyPlugin(config, plugins) {
  const pluginReference = PLUGIN_REFERENCE;

  let setupPlugins = config.plugins;

  if (plugins) {
    if (!setupPlugins) {
      config.plugins = setupPlugins = [];
    }

    for (let c = 0, length = plugins.length; length--; c++) {
      const config = plugins[c];
      let pluginName = config;
      let options = null;

      if (typeof config !== 'string') {
        pluginName = config.name;
        options = config.options || null;
      }

      setupPlugins[c] = pluginReference[pluginName](
        options,
        config
      );
    }
  }

  return config;
}
