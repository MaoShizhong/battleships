const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Battleships',
            template: './src/template.html',
            //favicon: './src/images/fav.ico',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(jpg|png|webp)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name]-[hash][ext]',
                },
            },
        ],
    },
};