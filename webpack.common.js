const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/ts/index.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    resolve: { extensions: ['.ts', '.js'] },
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
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
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
                                plugins: [[require('postcss-nested')], ['css-has-pseudo']],
                            },
                        },
                    },
                ],
            },
        ],
    },
};
