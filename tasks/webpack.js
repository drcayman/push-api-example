import path    from 'path'
import colors  from 'colors'
import webpack from 'webpack'
import process from 'process'
import merge   from 'webpack-merge'
import NotifierPlugin    from 'webpack-notifier'
import WriteFilePlugin   from 'write-file-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'

import { paths, app, hash } from './config'

const isProduction = (process.env.NODE_ENV === 'production')

////////////////////////////////////////////////////////////////

let config = {

    entry: {
        main: ['./js/main.js']
    },

    output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        path: path.resolve(__dirname, '../', paths.dest.root)
    },

    context: path.resolve(__dirname, '../' + paths.src.root),

    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'Img': path.resolve(__dirname, '../' + paths.src.img),
            'Icons': path.resolve(__dirname, '../' + paths.src.icons),
            '@': path.join(__dirname, '..', paths.src.js)

        }
    },

    stats: 'errors-only',

    devtool: isProduction ? false : 'cheap-module-eval-source-map',

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                plugins: ['syntax-dynamic-import'],
                presets: [ ['es2015', { 'modules': false }] ] // tree shaking
            }
        },
        {
            test: /\.svg/,
            loader: 'svg-url-loader?noquotes'
        },
        {
            test: /\.(png|jpe?g|gif)(\?.*)?$/,
            loader: 'url-loader',
            options: { limit: 15000, name: '[path][name].[ext]' }
        },
        {
            test: /\.(mp4|webm)(\?.*)?$/,
            loader: 'url-loader',
            options: { name: '[path][name].[ext]' }
        },
        {
            test: /\.vue$/,
            loader: 'vue-loader'
        }]
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new WriteFilePlugin({ test: /^js\/\w*(\.\w*)?\.js/, log: false }), // js/[name].[chunkhash].js
        new webpack.NoEmitOnErrorsPlugin(),
        new NotifierPlugin({
            contentImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAoCAMAAABDwLOoAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODczODExQ0I4QzhCMTFFNkIyRTA4MjlBNjEyOTBDREYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODczODExQ0E4QzhCMTFFNkIyRTA4MjlBNjEyOTBDREYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjhENjNBQkY5ODNDRTExRTZCMjk2REZBQkI5MUEyMjEwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhENjNBQkZBODNDRTExRTZCMjk2REZBQkI5MUEyMjEwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VQO1VAAAADBQTFRF6/D5h6fZaZDTtcztk7Pkm7vsnbrlpcHsi6zdlrfocJfbmLXie5/hgqPVkLDh////AJ+MUwAAABB0Uk5T////////////////////AOAjXRkAAAG7SURBVHjalNSLdoMgDADQQMJbsv//2+UBFrd25yxtlcI1AiLw9QzAjPCz7vkP8hijAHw2gCxkMBf4YADHyB5jnDeEoyMSJd/Hl4K7I9JSNLL/5P9WsAQ5eERenQfvSHtDJBVZKrDB5EVwn3AjRhVZSd4C75OZPEiGGOomejkiXyTHpRRxADbkBjFdXT7JlJlRA8GotfqgXGj0mhxl5lqHGCYiGReWJUxderNBTKxGSGtEKRxEUc3ewGaaRKoxXmf0GFJLgtQoSamEGGP3DCZipGSIM2RWkgoLMSUD60rUJE0khrbxpm45tNyKITdaLG0Zj3emFNL6fhqp/Hee5HmiKT09zDj7vDJ5wcYlRufHULni0SErsBO657k1Q3d3ZNZ1btc8sz3TJnd7dVkUFQXyuNieO7NdkFq4yWw2t5JF14asMbkbNbtipers2YWxrrEZZI14yGpjTTWttKNOwKrBdqwh1DmDxKqzan0zslUF/UrrDBt5TQZ/B0d4xfREK6q+qbD2lIPcZgaEc09Av4WZheZjT7BCkba5QntV4N0elecrGD7sdbgVP/bNH7sj2rjwjz3T1Py1934LMAB3AS3mv9xdmwAAAABJRU5ErkJggg=='
        }),
        new webpack.optimize.CommonsChunkPlugin({ // split in dev mode for avoid 404 error
            name: 'vendor',
            minChunks: ({ resource }) => /node_modules/.test(resource)
        })
    ]
}

////////////////////////////////

if( app && !isProduction ) {
    config = merge(config, {

        entry: {
            main: ['webpack/hot/dev-server', 'webpack-hot-middleware/client']
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
        ]

    })
}

////////////////////////////////

if( isProduction ) {

    let chunkhash = hash ? `.[chunkhash:5]` : '',
        filename  = 'js/[name]' + chunkhash + '.js'

    config = merge(config, {
        output: {
            filename,
            chunkFilename: filename,
            // chunkFilename: app ? filename : 'js/[name]',
            path: path.resolve(__dirname, '../' + paths.dest.root)
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"'
            }),
            new webpack.optimize.UglifyJsPlugin({
            	compress: {
                    warnings: false,
            		drop_console: true
            	},
            	sourceMap: true // just in case Webpack dev tools enabled
            }),
            new ProgressBarPlugin({ summary: false })
        ]
    })

    if( hash ) {
        config.plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                name: 'webpack-manifest',
                filename: '[name].js',
                chunks: ['vendor']
            })
        )
    }
}

function scripts() {

    return new Promise(resolve => webpack(config, (err, stats) => {

        console.log(stats.toString({
            assets: false,
            hash: false,
            timings: false,
            version: false,
            chunkModules: false
        }).green)

        resolve()

    }))
}

module.exports = { config, scripts }
