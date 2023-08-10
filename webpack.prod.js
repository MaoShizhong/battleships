const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.html$/i,
                use: 'html-loader',
            },
            {
                test: /\.(ttf|woff2)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name]-[hash][ext]',
                },
            },
        ],
    },
});
