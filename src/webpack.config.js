// // const webpack = require('webpack');
// const Dotenv = require('dotenv-webpack');
// // webpack.config.js

const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: "/api.js",
    output: {
      filename: "bundle.js",
      // path: __dirname + "/src"
    },
    resolve: {
        fallback: {
          "os": require.resolve("os-browserify/browser"),
          "path": require.resolve("path-browserify"),
        },
        alias: {
            process: "process/browser"
        },
    },
    plugins: [
      // new Dotenv({
      //   path: '.env',
      //   safe: true,
      // }),
      // new webpack.EnvironmentPlugin({
      //   BASEID: 'appNdjOgf8t8kpJoc',
      //   TABLEID: 'tblEOZLjb8fVOtWVd',
      //   TABLE_CREATOR_ID: 'tblsdwD9wMsnca6O4',
      //   API_KEY: 'keyt3vf4iF6tutTsK',
      //   TABLELOGIN: 'tbl7EqOTm9L6elNmv',
      // })
        // new Dotenv({systemVars: true}),
        // new webpack.DefinePlugin( {
        //     ...Object.entries(dotenv.config().parsed).reduce((acc, curr) => ({...acc, [`${curr[0]}`]: JSON.stringify(curr[1]) }), {}),
        // } ),
    ],
};

