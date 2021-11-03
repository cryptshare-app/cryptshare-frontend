// vue.config.js
module.exports = {
    devServer: {
        watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 300,
            poll: 1000
        },
    },
    css: {
        loaderOptions: {
            sass: {
                data: "@import \"@/assets/scss/_variables.scss\";"
            }
        }
    }
};