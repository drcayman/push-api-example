import webpack from 'webpack'
import config from './webpack.config'
import colors from 'colors'


export function scripts() {

    return new Promise(resolve => webpack(config, (err, stats) => {

        if( err ) console.log('Webpack', err)

        console.log(stats.toString({
            hash: false,
            timings: false,
            version: false,
            chunks: false
        }).green)

        resolve()
    }))
}
