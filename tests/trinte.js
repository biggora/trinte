#!/usr/bin/env node

/**
 * ExpressJs MVC Bootstrap
 * @Params - cmd - serve
 r | script | params
 */


/**
 * Framework version.
 */

var version = '0.0.1';

/**
 * Explicit module dependencies
 */
var fs = require('fs')
    , wrench = require('wrench')
    , nodepath = require('path')
    , exec = require('child_process').exec;

/**
 * Paths
 **/
var path = fs.realpathSync('.').replace(/\\/gi, "/");
var bootstrapPath = __dirname.replace(/\\/gi, "/").replace(/\/bin/gi, "");

/**
 * Main Command router
 */
var appLauncher = {
    command: 'cluster',
    server: { port: 3000 },
    script: { name: 'help',
        params: []
    }
};

for (var i in process.argv) {
    // Skip the first two - Node and app.js path
    if (i > 1) {
        processParam(process.argv[i], i);
    }
}

runLauncher(appLauncher);

/**
 * Run the launcher
 * @param appLauncher
 */
function runLauncher(appLauncher) {

    // Always use current directory?
    console.log('\r\n\x1b[36mLaunching bootstrap from: \x1b[0m ' + path);
    console.log('\x1b[36mScript directory: \x1b[0m ' + bootstrapPath + '/scripts');

    // Check if this is a bootstrap application?
    if (isLibrary()) {
        console.log('\x1b[1mDo not run this from the bootstrap library folder, please run from an empty directory or a bootstrapped app, or please run "npm install"\x1b[0m\r\n');
        return;
    }

    // Check if this is a bootstrap application?
    if (!isBootstrap() && appLauncher.command != 'create-app') {
        console.log('\x1b[1mApplication not bootstrapped - you must run:\x1b[0m trinte create-app\r\n');
        return;
    }

    switch (appLauncher.command) {
        case 'test':
            runTests(appLauncher.script);
            break;
        case 'cluster':
            runCluster(appLauncher.server.port);
            break;
        case 'server':
            runServer(appLauncher.server.port);
            break;
        case 'script':
            runScript(appLauncher.script);
            break;
        case 'create-app':
            createApplication(path);
            break;
        default:
            appLauncher.command = 'script';
            runScript(appLauncher.script);
    }

}

/**
 * Check if express app.js exists
 **/
function isLibrary() {
    return fs.existsSync(path + '/bin/trinte');
}

/**
 * Check if .bootstrap exists
 **/
function isBootstrap() {
    return fs.existsSync(path + '/.trinte-status');
}

/**
 * Run a script
 * @param appLauncher
 * Runs by default from path where bootstrap runs via __dirname.
 */
function runScript(scriptLauncher) {
    var script = require(bootstrapPath + '/scripts/' + scriptLauncher.name);
    script.execute(scriptLauncher.params, path);
}

/**
 * Process params into array to enable launch
 * @param param
 * @param params
 */
function processParam(param, depth) {

    var paramArray = param.split("=");

    // Run command - must always come after the app
    if (i == 2) {
        appLauncher.command = param;
    }

    // Server.port
    if (paramArray[0] == "server.port" && paramArray[1] != undefined) {
        appLauncher.server.port = paramArray[1];
    }

    //
    if ((appLauncher.command == "script" || appLauncher.command == "test") && i == 3) {
        appLauncher.script.name = param;
    }

    // Script params
    if (appLauncher.command == 'script' && i > 3) {
        appLauncher.script.params.push(param);
    }
}

/**
 * Run expresso tests
 */
function runTests(appLauncher) {

    var test = appLauncher.name ? appLauncher.name : 'all';

    if (test == 'help') {  // This is the default - ugly I know!
        test = ['unit', 'integration', 'functional'];
    } else {
        test = [test];
    }

    test.forEach(function (item, index) {
        exec('expresso -I . -s tests/' + item + ' ', { timeout: 60000, cwd: path }, function (error, stdout, stderr) {
            console.log("Finished test: " + item);
            console.log(stdout);
            console.log(stderr);
        });
    });
}

/**
 * Launch a server
 */
function runServer(port) {
    // Ensure we run in the local folder of the application
    process.chdir(path);
    var app = require(path + '/app').boot();
    app.listen(port);
    console.log('\r\n\x1b[36mApplication started on port:\x1b[0m ' + port);
}

/**
 * Launch a cluster
 */
function runCluster(port) {
    // Ensure we run in the local folder of the application
    process.chdir(path);
    require(path + '/app-cluster').boot(port, path);
    console.log('\r\n\x1b[36mLaunching cluster mode on port: \x1b[0m' + port);
}

/**
 * Application Creation - Borrowed from Express scripts
 **/

/**
 * Create application at the given directory `path`.
 *
 * @param {String} path
 */
function createApplicationAt(path) {

    mkdir(path + '/models', function () {
        // Disabled as no default models
        // copy(bootstrapPath + '/models',path + '/models');
    });

    mkdir(path + '/controllers', function () {
        wrench.copyDirSyncRecursive(bootstrapPath + '/controllers', path + '/controllers');
    });

    mkdir(path + '/conf', function () {
        wrench.copyDirSyncRecursive(bootstrapPath + '/conf', path + '/conf');
    });
    mkdir(path + '/utils', function () {
        wrench.copyDirSyncRecursive(bootstrapPath + '/utils', path + '/utils');
    });

    mkdir(path + '/views', function () {
        wrench.copyDirSyncRecursive(bootstrapPath + '/views', path + '/views');
    });
    mkdir(path + '/public', function () {
        wrench.copyDirSyncRecursive(bootstrapPath + '/public', path + '/public');
    });

    mkdir(path + '/lib', function () {
        wrench.copyDirSyncRecursive(bootstrapPath + '/lib', path + '/lib');
    });

    mkdir(path + '/tests', function () {
        mkdir(path + '/tests/unit', function () {
            wrench.copyDirSyncRecursive(bootstrapPath + '/tests/unit', path + '/tests/unit');
        });
        mkdir(path + '/tests/integration', function () {
            wrench.copyDirSyncRecursive(bootstrapPath + '/tests/integration', path + '/tests/integration');
        });
        mkdir(path + '/tests/functional', function () {
            wrench.copyDirSyncRecursive(bootstrapPath + '/tests/functional', path + '/tests/functional');
        });
    });

    mkdir(path + '/logs');
    mkdir(path + '/pids');

    copy(bootstrapPath + '/app-cluster.js', path + '/app-cluster.js');
    copy(bootstrapPath + '/app.js', path + '/app.js');

    write(path + '/.trinte-status', 'Created @ ' + new Date());

}

function createApplication(path) {
    emptyDirectory(path, function (empty) {
        if (empty) {
            createApplicationAt(path);
        } else {
            confirm('This will over-write the existing application, continue? ', function (ok) {
                if (ok) {
                    process.stdin.destroy();
                    createApplicationAt(path);
                } else {
                    abort('aborting');
                }
            });
        }
    });
};

/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */

function emptyDirectory(path, fn) {
    fs.readdir(path, function (err, files) {
        if (err && 'ENOENT' != err.code) console.log(err)// throw err;
        fn(!files || !files.length);
    });
}

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */

function write(path, str) {
    fs.writeFile(path, str);
    console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}

/**
 * Prompt confirmation with the given `msg`.
 *
 * @param {String} msg
 * @param {Function} fn
 */

function confirm(msg, fn) {
    prompt(msg, function (val) {
        fn(/^ *y(es)?/i.test(val));
    });
}

/**
 * Prompt input with the given `msg` and callback `fn`.
 *
 * @param {String} msg
 * @param {Function} fn
 */

function prompt(msg, fn) {
    // prompt
    if (' ' == msg[msg.length - 1]) {
        process.stdout.write(msg);
    } else {
        console.log(msg);
    }

    // stdin
    process.stdin.setEncoding('ascii');
    process.stdin.once('data',function (data) {
        fn(data);
    }).resume();
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir(path, fn) {
    fs.mkdir(path, 755, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('   \x1b[36mcreate\x1b[0m : ' + path);
        fn && fn();
    });
}

/**
 * cp -r
 *
 * @param {String} path
 * @param {Function} fn
 */

function copy(from, to, fn) {
    var stat = fs.statSync(from);
    if (stat.isDirectory()) {
        var files = fs.readdirSync(from)
            , count = 1;
        files.forEach(function (file) {
            fs.createReadStream(from + '/' + file).pipe(fs.createWriteStream(to + '/' + file));
            if (files.length == count) {
                console.log('   \x1b[36mCopied\x1b[0m : ' + from + ' to ' + to);
                fn && fn();
            }
            count++;
        });
    } else if (stat.isFile()) {
        fs.createReadStream(from).pipe(fs.createWriteStream(to));
        console.log('   \x1b[36mCopied\x1b[0m : ' + from + ' to ' + to);
        fn && fn();
    }
}

/**
 * Exit with the given `str`.
 *
 * @param {String} str
 */

function abort(str) {
    console.log("abort");
    console.error(str);
    process.exit(1);
}