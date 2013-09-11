[![Build Status](https://travis-ci.org/biggora/trinte.png?branch=master)](https://travis-ci.org/biggora/trinte)
# TrinteJS Javascript MVC Framework for NodeJS

A [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) boilerplate for [ExpressJS](http://expressjs.com/) backed by [CaminteJS](http://camintejs.com/) and [Bootstrap](http://twitter.github.com/bootstrap/index.html).

## Description

This application help to create a Webapp [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) `style` in few minutes. TrinteJS tuned for ExpressJS 3.x, jQuery 2.x and Twitter Bootstrap 3.x.

## Dependencies

- [Express 3.x](http://expressjs.com/).
- [jQuery 2.x](http://jquery.com/).
- [Twitter Bootstrap 3.x](http://getbootstrap.com/).

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
  * [Creates a scaffold with Namespace](#namespace)
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
* [Recommend extensions](#recommend)
* [Credits](#credits)
* [Peoject Author](#author)
* [Copyright & License](#license)
* [Resources](#resources)

<a name="usage"></a>
## Usage overview:

      $ trinte [command(s)] [argument(s)]

<a name="commands"></a>
### Command format:

      cluster *port=3000                      : Run the application using the cluster module.
      server *port=3000                       : Run the application as a server.
      test                                    : Run all tests.
      test unit|integration|functional        : Run a particular type of test.
      g, script help *<name>                  : This help script, optional script name for additional help.
      g, script <name> *args                  : Run a script with <name>, with params

      Available scripts (generators):

      controller, create-controller  args     : Creates a controller
      model, create-model  args               : Creates a model
      test, create-test  args                 : Creates a test
      view, create-view  args                 : Creates a view
      crud, generate-all  args                : Creates a scaffold
      help                                    : Show help


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
      or the same
      $ trinte g crud User

      // create User model and etc. with fields: name, email, password, active
      $ trinte script generate-all User name email password active:boolean

 - See all valid field types [here](#field-types).

<a name="model"></a>
### Create a model:

      // format: trinte script create-model [model name] [field(s)]

      // Create Post model without fields
      $ trinte script create-model Post
      or the same
      $ trinte g model Post

      // create User model with fields name, email, password, active: Boolean
      $ trinte script create-model User name email password active:boolean

 - See all valid field types [here](#field-types).

<a name="controller"></a>
### Create a controller:

      // Creates a controller
      $ trinte script create-controller Post
      or the same
      $ trinte g controller Post

<a name="view"></a>
### Create a views:

      // Creates views
      $ trinte script create-view Post
      or the same
      $ trinte g view Post

<a name="test"></a>
### Create a test:

      // Creates tests
      $ trinte script create-test HelloWorld

<a name="namespace"></a>
### Create a scaffold or other scripts with namespace:

      // Creates all (model, views, controller, tests)
      // all scripts will be generated in the folder 'namespase' name
      // as example app/admin/*
      $ trinte script generate-all admin#User
      or the same
      $ trinte g crud admin#User

      // create User model and etc. with fields: name, email, password, active
      $ trinte script generate-all admin#User name email password active:boolean

 - See all valid field types [here](#field-types).

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
      Boolean
      Text

Learn more on [CaminteJS](http://camintejs.com).

<a name="app-config"></a>
## Created application

### Application configuration
/config/configuration.js

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
    } ...
```

### Database configuration
/config/database.js

```js
module.exports = {
    db: {
        driver     : "mongoose",
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
    |-- config
    |   |-- configuration.js
    |   |-- database.js
    |   |-- development.js
    |   |-- production.js
    |   `-- test.js
    |-- tools
    |   `-- inflection.js
    |-- app
    |   |-- models
    |   |   |-- Category.js
    |   |   |-- Post.js
    |   |   `-- User.js
    |   |-- controllers
    |   |   |-- AppController.js
    |   |   `-- PostsController.js
    |   |-- heplers
    |   |   |-- ApplicationHelper.js
    |   |   `-- ModelsHelper.js
    |   |-- lib
    |   |   `-- pager.js
    |   `-- views
    |       |-- app
    |       |   `-- index.ejs
    |       `-- posts
    |       |   |-- edit.ejs
    |       |   |-- index.ejs
    |       |   `-- new.ejs
    |       |-- errors
    |       |   |-- 404.ejs
    |       }   `-- 500.ejs
    |       |-- default_layout.ejs
    |       |-- error_layout.ejs
    |       `-- messages.ejs
    |-- public
    |   |-- css
    |   |   `-- ...
    |   |-- js
    |   |   `-- ...
    |   `-- img
    |   |   `-- ...
    |-- package.json
    |-- app.js
    `-- app-cluster.js

<a name="routing"></a>
### Routing
/config/routes.js

#### Features

- resourceful routes
- generic routes
- url helpers
- namespaces
- custom helper names / paths for resources
- named parameters in url helpers

#### Named route params

Example:

    map.get('/test/:param1/:param2', 'controller#action');
    map.pathTo.test({param1: 'foo', param2: 'bar'}); // '/test/foo/bar'

#### Singleton resources

Example:

    map.resource('post');

Will generate the following routes:

    method    route            controller#action   helper method
    --------------------------------------------------------------------------
    GET       /posts           posts#index         pathTo.posts()
    GET       /post/:id        posts#show          pathTo.show_post(id)
    POST      /post            posts#create        pathTo.create_posts()
    GET       /post/new        posts#new           pathTo.new_post()
    GET       /post/edit/:id   posts#edit          pathTo.edit_post(id)
    DELETE    /post/:id        posts#destroy       pathTo.destroy_post(id)
    PUT       /post/:id        posts#update        pathTo.update_post(id)
    DELETE    /posts           posts#destroyall    pathTo.destroy_posts()

Singleton resources can also have nested resources. For example:

    map.resource('users', function(users) {
      users.resources('posts');
    });

Will generate the following routes:

    method   route                         controller#action   helper method
    --------------------------------------------------------------------------
    GET     /users/:user_id/posts           posts#index        pathTo.users_posts(user_id)
    GET     /users/:user_id/post/:id        posts#show         pathTo.show_users_post(user_id, id)
    POST    /users/:user_id/post            posts#create       pathTo.create_users_posts(user_id)
    GET     /users/:user_id/post/new        posts#new          pathTo.new_users_post(user_id)
    GET     /users/:user_id/post/edit/:id   posts#edit         pathTo.edit_users_post(user_id, id)
    DELETE  /users/:user_id/post/:id        posts#destroy      pathTo.destroy_users_post(user_id, id)
    PUT     /users/:user_id/post/:id        posts#update       pathTo.update_users_post(user_id, id)
    DELETE  /users/:user_id/posts           posts#destroyall   pathTo.destroy_users_posts(user_id)


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

<a name="recommend"></a>
### Recommend extensions

- [CaminteJS](http://www.camintejs.com/) - Cross-db ORM for NodeJS
- [2CO](https://github.com/biggora/2co) - is the module that will provide nodejs adapters for 2checkout API payment gateway.

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
- [NPM](http://npmjs.org/): Node package manager, used to install:
- [Express.Js](http://expressjs.com/): Application Framework for Node.js
- [Caminte.Js](http://camintejs.com/): Node.JS ORM for Any DB.
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
