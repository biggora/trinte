[![Build Status](https://travis-ci.org/biggora/trinte.png?branch=master)](https://travis-ci.org/biggora/trinte) <a style="float:right;" href='http://www.pledgie.com/campaigns/19004'><img alt='Click here to lend your support to: TrinteJS and make a donation at www.pledgie.com !' src='http://www.pledgie.com/campaigns/19004.png?skin_name=chrome' border='0' /></a>
# TrinteJS Javascript MVC Framework for NodeJS

A [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) boilerplate for [ExpressJS](http://expressjs.com/) backed by [MongooseJS](http://mongoosejs.com/) and [Bootstrap](http://twitter.github.com/bootstrap/index.html),
based on [Express MVC Bootstrap](https://github.com/cliftonc/express-mvc-bootstrap).

## Description

This application help to create a Webapp [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) `style` in few minutes.

## Installation
Installation is done using the NodeJS Package Manager (npm). If you don't have npm installed on your system you can download it from [npmjs.org](http://npmjs.org/)
To install trinte:

    $ sudo npm install trinte -g

## Table of contents
* [Get started!](#start)
* [Usage overview](#usage)
  * [Command format](#commands)
  * [Create and initialize app](#create-app)
  * [Creates a scaffold](#scaffold)
  * [Creates a Model](#model)
  * [Creates a Controller](#controller)
  * [Creates a View](#view)
  * [Field types](#field-types)
  * [Runs server](#runs-server)
* [Created application](#directory-structure)
  * [Application configuration](#app-config)
  * [Directory structure](#directory-structure)
  * [Routing and params](#routing)
  * [Used Middleware](#middleware)
* [Credits](#credits)
* [Peoject Author](#author)
* [Copyright & License](#license)
* [Resources](#resources)

<a name="usage"></a>
## Usage overview:

      $ trinte [command(s)] [argument(s)]

<a name="commands"></a>
### Command format:

      cluster *port=3000                : Run the application using the cluster module.
      server *port=3000                 : Run the application as a server.
      test                              : Run all tests.
      test unit|integration|functional  : Run a particular type of test.
      script help *<name>               : This help script, optional script name for additional help.
      script <name> *args               : Run a script with <name>, with params

      Available scripts:

      create-controller  args           : Creates a controller
      create-model  args                : Creates a model
      create-test  args                 : Creates a test
      create-view  args                 : Creates a view
      generate-all  args                : Creates a scaffold
      help                              : Show help


<a name="start"></a>
<a name="create-app"></a>
###  Create and initialize app

      $ trinte create-app HelloWorld    # Create application
      $ cd HelloWorld && npm -l install # intall dependencies

      # generate scaffold
      $ trinte script generate-all User name email password active
      $ trinte                          # running server (default in cluster mode)

  - Browse your application to [http://localhost:3000](http://localhost:3000)

<a name="scaffold"></a>
### Shows help:

      // Shows help
      $ trinte help
      $ trinte script help generate-all

<a name="scaffold"></a>
### Create a scaffold:

      // Creates all (model, views, controller, tests)
      $ trinte script generate-all User

      // create User model and etc. with fields: name, email, password, active
      $ trinte script generate-all User name email password active:boolean

 - See all valid field types [here](#field-types).

<a name="model"></a>
### Create a model:

      // format: trinte script create-model [model name] [field(s)]

      // Create Post model without fields
      $ trinte script create-model Post

      // create User model with fields name, email, password, active: Boolean
      $ trinte script create-model User name email password active:boolean

 - See all valid field types [here](#field-types).

<a name="controller"></a>
### Create a controller:

      // Creates a controller
      $ trinte script create-controller Post

<a name="view"></a>
### Create a views:

      // Creates views
      $ trinte script create-view Post

<a name="test"></a>
### Create a test:

      // Creates tests
      $ trinte script create-test HelloWorld

<a name="runs-server"></a>
### Runs server:

      $ trinte                         // Runs server in cluster mode
      $ trinte server                  // Runs server in simple mode
      $ trinte cluster                 // Runs server in cluster mode

      # Runs server in simple mode on different port
      $ trinte server port=3000

<a name="field-types"></a>
### Field types:
Following are all valid field types.

      String
      Number
      Date
      Buffer
      Boolean
      Mixed
      ObjectId
      Array

Learn more on [MongooseJS](http://mongoosejs.com/docs/schematypes.html).

<a name="app-config"></a>
## Created application

### Application configuration
/config.js

```js
module.exports = {
    port : 3000,
    session: {
        maxAge : 8640000,
        key : "trinte",
        secret : "Web-based Application"
    },
    parser : {
        encoding : "utf-8",
        keepExtensions : true
    },
    db: {
        host       : "localhost",
        port       : "27017",
        username   : "",
        password   : "",
        database   : "trinte-dev"
    } ...
```

<a name="directory-structure"></a>
### Directory structure

On initialization directories tree generated, like that:

    .
    |-- conf
    |   |-- configuration.js
    |   |-- development.js
    |   |-- production.js
    |   `-- test.js
    |-- controllers
    |   |-- AppController.js
    |   `-- PostsController.js
    |-- lib
    |   `-- inflection.js
    |-- models
    |   |-- Category.js
    |   |-- Post.js
    |   `-- User.js
    |-- public
    |   |-- css
    |   |   `-- ...
    |   |-- js
    |   |   `-- ...
    |   `-- img
    |   |   `-- ...
    |-- views
    |   |-- app
    |   |   `-- index.html
    |   `-- posts
    |   |   |-- edit.html
    |   |   |-- index.html
    |   |   `-- new.html
    |   |-- layout.html
    |   |-- 404.html
    |   `-- 500.html
    |-- utils
    |   |-- helper.js
    |   `-- pager.js
    |-- package.json
    |-- app.js
    `-- app-cluster.js

<a name="routing"></a>
### Routing

    // Plural
    app.get("/:controller?", router);                           // Index
    app.get("/:controller.:format?", router);                   // Index
    app.get("/:controller/:from-:to.:format?", router);         // Index

    // Plural Create & Delete
    app.post("/:controller", router);                           // Create
    app.del("/:controller", router);                            // Delete all

    // Singular - different variable to clarify routing
    app.get("/:controller/:action", router);                    // Add (New) and custom actions
    app.get("/:controller/:id.:format?", router);               // To support controller/index
    app.get("/:controller/:id/:action", router);                // Show edit
    app.put("/:controller/:id", router);                        // Update
    app.del("/:controller/:id", router);                        // Delete

### Params

    app.param('id', /^[A-Za-z0-9]+$/);
    app.param('controller', /^[a-zA-Z]+$/);
    app.param('action', /^[a-zA-Z]+$/);
    app.param('format', /^[a-zA-Z]+$/);
    app.param('from', /^\d+$/);
    app.param('to', /^\d+$/);

<a name="middleware"></a>
### Used Middleware

- [express-useragent](https://github.com/biggora/express-useragent) NodeJS user-agent middleware.
- [express-mongodb](https://github.com/biggora/express-mongodb) MongoDB Session Storage for ExpressJS.
- [csrf](http://www.senchalabs.org/connect/csrf.html) CSRF protection middleware.

<a name="in-the-wild"></a>
## In the Wild

The following projects use TrinteJS.

If you are using TrinteJS in a project, app, or module, get on the list below
by getting in touch or submitting a pull request with changes to the README.

<a name="startups-and-apps"></a>
### Startups & Apps

- [TViMama](http://tvimama.com/)
- [GorkaTV](https://gorkatv.com/)

<a name="credits"></a>
## Credits

- [Node.js](http://nodejs.org/): Amazing javascript asynchronous IO library, install manually.
- [MongoDB](http://www.mongodb.org/): NoSQL Database, install manually.
- [NPM](http://npmjs.org/): Node package manager, used to install:
- [Express.Js](http://expressjs.com/): Application Framework for Node.js
- [Mongoose.Js](http://mongoosejs.com/): Node.JS ORM for MongoDB.
- [EJS](http://embeddedjs.com/): Embedded Javascript Templating Library.
- [jQuery](http://jquery.com/): Best Javascript Library.
- [Bootstrap](http://twitter.github.com/bootstrap/index.html): Powerful front-end CSS/JS framework
- [Glyphicons](http://glyphicons.com/): Fantastic library of precisely prepared monochromatic icons and symbols.

<a name="author"></a>
## Author

Aleksej Gordejev (aleksej@gordejev.lv).

<a name="license"></a>
## Copyright & License

(The MIT License)

Copyright (c) 2012 Aleksej Gordejev <aleksej@gordejev.lv>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

<a name="resources"></a>
## Resources

- Visit the [author website](http://www.gordejev.lv).
- Follow [@biggora](https://twitter.com/#!/biggora) on Twitter for updates.
- Report issues on the [github issues](https://github.com/biggora/trinte/issues) page.
