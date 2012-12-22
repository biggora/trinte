# TrinteJS MVC Framework

A MVC boilerplate for Express.js

## Description

This application help to create a webapp MVC `style` app in few minutes.

## Requires
  - [express](http://expressjs.com/): Application Framework for Node.js
  - [mongoose](http://mongoosejs.com/): Node.js ORM for MongoDB
  - [ejs](http://embeddedjs.com/): EmbeddedJS Templating
  - [wrench] (https://github.com/ryanmcgrath/wrench-js): Recursive file operations in Node.js

## Installation

    $ sudo npm install trinte -g

## Setup
  -  Create and initialize app

<!---->
      // create app
      $ trinte create-app HelloWorld

      // intall deps
      $ cd HelloWorld && npm -l install

      // running server
      $ trinte

  - Browse your app to http://localhost:3000

Directory structure
-------------------

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

Routing
-------

    // Plural
    app.get("/:controller?", router);				// Index
    app.get("/:controller.:format?", router);			// Index
    app.get("/:controller/:from-:to.:format?", router);		// Index

    // Plural Create & Delete
    app.post("/:controller", router);			        // Create
    app.del("/:controller", router);   			        // Delete all

    // Singular - different variable to clarify routing
    app.get("/:controller/:action", router);                    // Add (New) and custom actions
    app.get("/:controller/:id.:format?", router);  	        // To support controller/index
    app.get("/:controller/:id/:action", router);		// Show edit
    app.put("/:controller/:id", router);			// Update
    app.del("/:controller/:id", router);			// Delete


## Generators:

      // Shows help
      $ trinte script

      // Wrapper for 3 commands below
      $ trinte script generate-all HelloWorld

      // Creates a model
      $ trinte script create-model HelloWorld

      // Creates a controller
      $ trinte script create-controller HelloWorld

      // Creates views
      $ trinte script create-view HelloWorld

      // Creates tests
      $ trinte script create-test HelloWorld

      // Runs server on different port
      $ trinte server server.port=3000

      // Creates a new app
      $ trinte create-app


## In the Wild

The following projects use express-useragent.

If you are using express-useragent in a project, app, or module, get on the list below
by getting in touch or submitting a pull request with changes to the README.

### Startups & Apps

- [TViMama](http://tvimama.com/)
- [GorkaTV](https://gorkatv.com/)

## Credits

- [Node.js](http://nodejs.org/): Amazing javascript asynchronous IO library, install manually.
- [MongoDB](http://www.mongodb.org/): NoSQL Database, install manually.
- [NPM](http://npmjs.org/): Node package manager, used to install:
-- [Express.Js](http://expressjs.com/): Application Framework for Node.js
-- [Mongoose.Js](http://mongoosejs.com/): Node.JS ORM for MongoDB.
-- [EJS](http://embeddedjs.com/): Embedded Javascript Templating Library.
- [jQuery](http://jquery.com/): Best Javascript Library.
- [Bootstrap](http://twitter.github.com/bootstrap/index.html): Powerful front-end CSS/JS framework
- [Glyphicons](http://glyphicons.com/): Fantastic library of precisely prepared monochromatic icons and symbols.

## Author

Aleksej Gordejev (aleksej@gordejev.lv).

## License

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


## Resources

- Visit the [author website](http://www.gordejev.lv).
- Follow [@biggora](https://twitter.com/#!/biggora) on Twitter for updates.
- Report issues on the [github issues](https://github.com/biggora/trinte/issues) page.
