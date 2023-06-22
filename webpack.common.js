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
            template: './src/html/template.html',
            favicon: './src/images/ship.ico',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 1 },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [require('postcss-nested')],
                                    ['css-has-pseudo',],
                                ]
                            }
                        }
                    },
                ],
            },
            {
                test: /\.html$/i,
                use: 'html-loader',
            },
            {
                test: /\.(jpg|png)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name]-[hash][ext]',
                },
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
};