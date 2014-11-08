var fs = require('fs'),
    path = require('path');

function logProject(dir, root, config) {
    console.log('# Project:');
    console.log('- Name: ' + (config.name || '') + ' (' + (config.version || '-') + ')');
    console.log('- Dir: ./' + path.relative(root, dir));
    console.log('- Compiler: ' + (config.compiler || ''));
    console.log('- Description: ' + (config.description || ''));
    console.log('- Repository: ' + ((
        typeof config.repository === 'string' ?
            config.repository :
            config.repository && config.repository.url
    ) || ''));
    console.log('- Export:');
    config.export.forEach(function(item) {
        console.log('    ' + ((
            typeof item === 'string' ?
            item : item && item.path
        ) || ''));
    });
    console.log('');
}

function analyseDir(dir, root) {
    var configFile = path.join(dir, 'fekit.config'),
        fekitConfig = null;
    if (fs.existsSync(configFile)) {
        try {
            fekitConfig = JSON.parse(fs.readFileSync(configFile, 'UTF-8'));
            logProject(dir, root, fekitConfig);
        } catch(e) {}
    }
}

exports.usage = "扫描目录下的fekit项目";

exports.set_options = function(optimist){
    optimist.alias('p', 'path');
    optimist.describe('p', '扫描的路径');
    return optimist;
};

exports.run = function(options){
    var root = options.cwd,
        files = [];
    if (options.path && options.path !== true) {
        root = options.path;
    }
    analyseDir(root, root);
    files = fs.readdirSync(root);
    files.forEach(function(file) {
        var pathname = path.join(root, file),
            stat = fs.lstatSync(pathname);
        if (stat.isDirectory()) {
            analyseDir(pathname, root);
        }
    });
};
