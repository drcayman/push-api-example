const path            = require('path')
const del             = require('del')
const config          = require('./project.config')
const webpack         = require('webpack')
const process         = require('process')
const merge           = require('webpack-merge')
const NotifierPlugin  = require('webpack-notifier')
const WriteFilePlugin = require('write-file-webpack-plugin')

const isProduction = (process.env.NODE_ENV === 'production')

let SRC_ROOT  = config.SRC_ROOT
let DEST_ROOT = config.DEST_ROOT
let src  = config.src,
    dest = config.dest,
    app  = config.app,
    hash = config.hash

let chunkhash = hash ? '.[chunkhash:3]' : ''

if( isProduction && hash ) del(dest.js) // to overwrite hashes

////////////////////////////////////////////////////////////////
// DEVELOPMENT
let commonDev = {

    entry: {
        main: ['./js/main.js']
    },

    output: {
        filename: 'js/[name]' + chunkhash + '.js',
        chunkFilename: 'js/[name]' + chunkhash + '.js',
        path: path.join(__dirname, DEST_ROOT)
    },

    context: path.join(__dirname, SRC_ROOT),

    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'Img': path.join(__dirname, SRC_ROOT + '/assets/img'),
            'Icons': path.join(__dirname, SRC_ROOT + '/assets/icons'),
            '@': path.join(__dirname, '..', 'src')

        }
    },

    stats: 'errors-only',

    devtool: isProduction ? false : 'cheap-module-eval-source-map',
    node: { Buffer: false }, // reduce vendor size ~24KB

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            // options: {
            //     'babelrc': false,
            //     'presets': [ ['es2015', { 'modules': false }] ] // Webpack handles modules
            // }
        },
        {
            test: /\.svg/,
            loader: 'svg-url-loader'
        },
        {
            test: /\.(png|jpe?g|gif)(\?.*)?$/,
            loader: 'url-loader',
            options: { limit: 10000, name: 'assets/img/[name].[ext]' }

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
        new WriteFilePlugin({ log: false }), // only write JS files
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
    module.exports = merge(commonDev, {

        entry: {
            main: ['webpack/hot/dev-server', 'webpack-hot-middleware/client']
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
        ]

    })
}
else if( !isProduction ) module.exports = commonDev


////////////////////////////////

const commonProduction = {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                drop_console: true,
                warnings: false
            },
            sourceMap: true // just in case
         })
    ]
}

////////////////////////////////

if( isProduction ) module.exports = merge(commonDev, commonProduction)
