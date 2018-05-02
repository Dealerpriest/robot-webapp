// vue.config.js
const MyPreloadPlugin = require('./preload-webpack-plugin');

module.exports = {
  // vue.config.js
  // configureWebpack: {
  //   plugins: [
  //     new PreloadPlugin()
  //   ],
  //   webpackConfig
  //     .plugin('preload')
  //       .use(PreloadPlugin, [{
  //         rel: 'preload',
  //         include: 'initial',
  //         fileBlacklist: [/\.map$/, /hot-update\.js$/]
  //       }])

  //   webpackConfig
  //     .plugin('prefetch')
  //       .use(PreloadPlugin, [{
  //         rel: 'prefetch',
  //         include: 'asyncChunks'
  //       }])
  // },

  chainWebpack: config => {
    // A, remove the plugin
    config.plugins.delete(['prefetch', 'preload']);

    config.plugin('preload').use(MyPreloadPlugin, [
      {
        rel: 'preload',
        include: 'initial',
        fileBlacklist: [/\.map$/, /hot-update\.js$/]
      }
    ]);

    config.plugin('prefetch').use(MyPreloadPlugin, [
      {
        rel: 'prefetch',
        include: 'asyncChunks',
        exclude: ['root.robot']
      }
    ]);

    // or:
    // B. Alter settings:
    // config.plugin('prefetch').tap(options => {
    //   options.fileBlackList.push([/robot\.?\.js$/]);
    //   return options;
    // });
  }
};
//regex example from linus:     *.route.*.js
//                /myasyncRoute(.)+?\.js$/
// kjgjadfkjga.kjhgsdfdkj.robot.kjhgsdf.js

//root.robot.238092490r2bqwkn.js
/*webpackChunkName: 'root.robot'*/
