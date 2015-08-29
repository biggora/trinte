#!/usr/bin/env node
/**
 * TrinteJS MVC Bootstrap
 * 
 * @project  trinte
 * @author   Alexey Gordeyev
 * @created  2013-09-27 07:25:26
 * @Params - cmd - server | script | params
 * 
 */

/**
 * Explicit module dependencies
 */
var fs = require('fs');
var creator = require('trinte-creator');
var util = creator.util;
var logger = creator.logger;
var installer = require('./installer');
var child = require('child_process');
var exec = child.exec;

/**
 * Paths
 **/
var projectPath = fs.realpathSync('.').replace(/\\/gi, "/");
var bootstrapPath = __dirname.replace(/\\/gi, "/").replace(/\/lib$/gi, "");
var args = process.argv.slice(2);
var appLauncher = util.parseArgs(args);
var ucmd = "echo $(whoami)";

if (util.isWindows()) {
    ucmd = "echo %username%";
}

/**
 * Framework version.
 */

var version = require(bootstrapPath + '/package.json').version;

appLauncher.projectPath = projectPath;
appLauncher.bootstrapPath = bootstrapPath;

switch (appLauncher.command) {
    case 'V':
    case "version":
        process.stdout.write(version);
        process.exit(1);
        break;
    case 'init':
        exec(ucmd, function(error, stdout, stderr) {
            appLauncher.author = (stdout || "").replace(/^\s+|\s+$/, "");
            creator.createApp(appLauncher);
            logger.verbose('Create TrinteJS Application ' + appLauncher.name);
        });
        break;
    case 'script':
        creator.createScript(appLauncher);
        break;
    case 'server':
        util.runServer(appLauncher);
        break;
    case 'cluster':
        util.runCluster(appLauncher);
        break;
    case 'install':
        installer.installModule(appLauncher);
        break;
    default:
        creator.showHelp(appLauncher, version);
}

function allClose(e) {
    process.stdout.write('\x1B[39m\r\n');
    logger.critical('Process Aborting!', false);
    process.exit(1);
}

// process.on('SIGSTOP', allClose);
process.on('SIGINT', allClose);
process.on('SIGTSTP', allClose);
process.on('SIGTERM', allClose);

process.on('exit', function(e) {
    process.stdout.write('\x1B[39m\r\n');
});

/*
 logger.notice('notice log to file');
 logger.input('input log to file');
 logger.verbose('verbose log to file');
 logger.alert('alert log to file');
 logger.critical('crit log to file', true);
 logger.info('info log to file');
 logger.status('status log to file');
 logger.msg('msg log to file');
 logger.data('data log to file');
 logger.help('help log to file');
 logger.warning('warning log to file', true);
 logger.debug('debug log to file');
 logger.error('error log to file');
 console.log(appLauncher)
 */