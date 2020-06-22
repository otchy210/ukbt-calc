const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        main: './src/js/main.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve('./docs/js')
    },
};
