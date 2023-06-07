const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist', 'browser'),
        filename: 'index.js',
        library: 'ThreeManga',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, 'tsconfig.browser.json'),
                    },
                },
                exclude: /node_modules/,
            },
        ],
    },
};