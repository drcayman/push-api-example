import path from 'path'
import webpack from 'webpack'


module.exports = {
    output: {
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
                presets: ['es2015'],
                plugins: ['transform-strict-mode']
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
        })
    ]
}
