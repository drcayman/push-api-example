import path from 'path'
import webpack from 'webpack'
import yargs from 'yargs'

const argv = yargs.argv


const Common =
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


const Uglify =
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        comments: /sourceMappingURL/g
    })


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
    plugins: argv.production ? [Common, Uglify] : [Common]
}
