var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: "./main.js",
  output: {
    path: "./build",
    publicPath: "/build/",
    filename: "build.js"
  },
  module: {
    loaders: [
      { test: /\.vue$/, loader: "vue" },
      { 
        test: /\.js$/, 
        loader:'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['es2015']
        }  
      },
      { test: /\.html$/, loader: "html" },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader','css-loader') },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('vue-style-loader','css!sass') }
    ]
  },
  target: 'node-webkit',
  plugins:[
    new ExtractTextPlugin("style.css")
  ],
  vue: {
    loaders: {
      scss: ExtractTextPlugin.extract('vue-style-loader','css!sass'),
      sass: ExtractTextPlugin.extract('vue-style-loader','css!sass')
    }
  } 
}