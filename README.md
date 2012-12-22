# TrinteJS Javascript MVC Framework for NodeJS

A [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) boilerplate for [ExpressJS](http://expressjs.com/) backed by [MongooseJS](http://mongoosejs.com/)

## Description

This application help to create a Webapp [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) `style` in few minutes.

## Installation
Installation is done using the NodeJS Package Manager (npm). If you don't have npm installed on your system you can download it from [npmjs.org](http://npmjs.org/)
To install trinte:

    $ sudo npm install trinte -g

## Short usage overview
  -  Create and initialize app

<!---->
      // create app
      // trinte [command] [Your Application Name]
      $ trinte create-app HelloWorld

      // intall dependencies
      $ cd HelloWorld && npm -l install

      // running server (default in cluster mode)
      $ trinte

  - Browse your application to [http://localhost:3000](http://localhost:3000)

## CLI tool:

      Usage: trinte command 1 command 2 [argument(s)]

      // Shows help
      $ trinte script

      // Creates all (models, views, controllers, tests)
      $ trinte script generate-all User
      // or
      $ trinte script generate-all User name email password active:boolean
      // generated User model and etc. with fields: name, email, password, active

      // Creates a model
      $ trinte script create-model Post

      // Creates a controller
      $ trinte script create-controller Post

      // Creates views
      $ trinte script create-view Post

      // Creates tests
      $ trinte script create-test HelloWorld

      // Runs server on different port
      $ trinte server server.port=3000

      // Creates a new app
      $ trinte create-app MyShop

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
- [Express.Js](http://expressjs.com/): Application Framework for Node.js
- [Mongoose.Js](http://mongoosejs.com/): Node.JS ORM for MongoDB.
- [EJS](http://embeddedjs.com/): Embedded Javascript Templating Library.
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
