// vue.config.js

module.exports = {
  chainWebpack: config => {
    // A, remove the plugin
    config.plugins.delete('prefetch');

    // or:
    // B. Alter settings:
    // config.plugin('prefetch').tap(options => {
    //   options.fileBlackList.push([/robot.*.js$/]);
    //   return options;
    // });
  }
};

//                /myasyncRoute(.)+?\.js$/
// kjgjadfkjga.kjhgsdfdkj.robot.kjhgsdf.js
