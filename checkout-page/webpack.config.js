const path = require('path');

module.exports = {
    entry: './src/sdk/PaymentGateway.js',
    output: {
        filename: 'checkout.js',
        path: path.resolve(__dirname, 'public'),
        library: 'PaymentGateway',
        libraryTarget: 'umd',
        globalObject: 'this',
        libraryExport: 'default'
    },
    mode: 'production',
};
