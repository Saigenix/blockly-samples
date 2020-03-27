/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Webpack base configuration file.
 * @author samelh@google.com (Sam El-Husseini)
 */

const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const packageJson = require(resolveApp('package.json'));
console.log(`Building ${packageJson.name}`)

module.exports = env => {
    const src = {
        name: "src",
        mode: env.mode,
        entry: "./src/index.js",
        devtool: 'source-map',
        output: {
            path: resolveApp('dist'),
            publicPath: '/dist/',
            filename: 'index.js',
            libraryTarget: 'umd',
            globalObject: 'this'
        },
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }]
        },
        externals: {
            'blockly/core': {
                root: 'Blockly',
                commonjs: 'blockly/core',
                commonjs2: 'blockly/core',
                amd: 'blockly/core'
            },
        }
    };
    const webpackExports = [src];

    if (env.buildTest) {
        const test = {
            name: "test",
            mode: "development",
            entry: "./test/index.js",
            devtool: 'source-map',
            output: {
                path: resolveApp('build'),
                publicPath: '/build/',
                filename: 'test_bundle.js'
            },
            module: {
                rules: [{
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"]
                        }
                    }
                }]
            },
            devServer: {
                openPage: 'test',
                port: 3000,
                open: true
            },
        }
        webpackExports.push(test);
    }
    return webpackExports;
};