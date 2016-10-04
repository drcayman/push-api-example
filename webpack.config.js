import path from 'path'
import webpack from 'webpack'


module.exports = {
    output: {
        //filename: 'main.js',
        path: '/build',
        filename: '[name].js',
    },
    devtool: 'source-map',
    bail: false,
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                babelrc: false,
                plugins: ['transform-es2015-modules-commonjs',
                          'transform-strict-mode']
            }
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '/node_modules')
                    ) === 0
                )
             }
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'webpack',
        //     chunks: ['vendor']
        // }),
        // new webpack.ProvidePlugin({
        //     'Promise': 'exports?global.Promise!es6-promise',
        //     'window.fetch': 'exports?self.fetch!whatwg-fetch'
        // })
    ]
}
