const fs = require('fs')

const incFromPackage = (package) => {
    let currentVersion = require(package).version;
    let currentVersionNums = currentVersion.split('.');
    currentVersionNums[2]++;
    return currentVersionNums.join(".");
}

const replaceInFile = (file, find, replace) => {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(find, replace);
        fs.writeFile(file, result, 'utf8', function (err) {
            if (err) 
                return console.log(err);
            else
                console.log("File " + file + " patched.");
        });
    });
}   

class WebpackVersionBumpPlugin {

    constructor(options) {
        this._options = options;
        this._options.package = this._options.package || './package.json';
        this._options.places  = this._options.places  || [];
        this.newVersion = null;
    }

    apply (compiler) {
        compiler.hooks.beforeRun.tap('VersionBumpPlugin', compiler => {
            this.newVersion = incFromPackage(this._options.package);
            console.log (`Version Bump to ${this.newVersion} before `);
            this._options.places.forEach(p => {
                if (p.mode == "before" || !p.mode)
                    replaceInFile(p.filename, p.find, p.replace(this.newVersion));
            })
        });

        compiler.hooks.done.tap('VersionBumpPlugin', compiler => {
            console.log (`Version Bump to ${this.newVersion} after `);
            this._options.places.forEach(p => {
                if (p.mode == "after")
                    replaceInFile(p.filename, p.find, p.replace(this.newVersion));
            })
        });
    } 

}

module.exports.WebpackVersionBumpPlugin = WebpackVersionBumpPlugin;