# !!! This Plugin still requires quite some work !!!

# webpack-version-bump-plugin
Plugin to write Version String From package.json into Source Files

# Install
```js
    npm install -D @sekp/webpack-version-bump-plugin
```

# Setup in webpack.config.js
```js
const { WebpackVersionBumpPlugin } = require('@sekp/webpack-version-bump-plugin');
//...
plugins: [
    //...
    new WebpackVersionBumpPlugin({
        package: path.resolve(__dirname, "package.json"),
        places: [
            {
                filename: path.resolve(__dirname, "public/serviceworker.js"),
                find: /^var CACHE_NAME =(.*)$/m,
                replace: (newVersion) => `var CACHE_NAME = "${newVersion}";`
            }, {
                filename: path.resolve(__dirname, "package.json"),
                find: /^\s*\"version\":.*$/m,
                replace: (newVersion) => `  "version": "${newVersion}",`
            }, {
                filename: path.resolve(__dirname, "package-lock.json"),
                find: /^\s*\"version\":.*$/m,
                replace: (newVersion) => `  "version": "${newVersion}",`
            }
        ]
    })
]