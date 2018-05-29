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
    }

    apply (compiler) {
        compiler.hooks.beforeRun.tap('VersionBumpPlugin', compiler => this.dowork());
    } 

    dowork() {
        let newVersion = incFromPackage(this._options.package);
        console.log (`Version Bump to ${newVersion}`);
        this._options.places.forEach(p => {
            replaceInFile(p.filename, p.find, p.replace(newVersion));
        })
    }
}

module.exports.WebpackVersionBumpPlugin = WebpackVersionBumpPlugin;