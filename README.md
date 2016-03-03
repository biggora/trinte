[![Build Status](https://travis-ci.org/biggora/trinte.png?branch=master)](https://travis-ci.org/biggora/trinte)
[![Dependency Status](https://gemnasium.com/biggora/trinte.png)](https://gemnasium.com/biggora/trinte)
[![NPM version](https://badge.fury.io/js/trinte.png)](http://badge.fury.io/js/trinte)
# TrinteJS Javascript MVC Framework for NodeJS

A [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) boilerplate for [ExpressJS](http://expressjs.com/) backed by [CaminteJS](http://camintejs.com/) and [Bootstrap](http://twitter.github.com/bootstrap/index.html).

## Description

This application help to create a Webapp [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) `style` in few minutes. TrinteJS tuned for ExpressJS 4.x, jQuery 2.x and Twitter Bootstrap 3.3.6.

## Dependencies

- [Express 4.x](http://expressjs.com/).
- [jQuery 2.2.x](http://jquery.com/).
- [Twitter Bootstrap 3.3.x](http://getbootstrap.com/).
- [Bootswatch 3.3.x](https://bootswatch.com/).

## Installation
Installation is done using the NodeJS Package Manager (npm). If you don't have npm installed on your system you can download it from [npmjs.org](http://npmjs.org/)

First install required dependencies:

    $ sudo npm install bower mocha gulp npm -g

To install trinte:

    $ sudo npm install trinte -g
    
### Get started!

    $ trinte -i HelloWorld --sess --theme semargl  # Create application
    $ cd HelloWorld && npm install                 # intall dependencies

    # generate scaffold
    $ trinte -g crud User active:bool name email password about:text created:date
      
    # start test
    $ npm test
      

## Supported databases:

* MySQL / MariaDB
* PostgreSQL
* SQlite
* MongoDB
* Redis
* RethinkDB
* Riak
* CouchDB
* Neo4j
* Firebird
* TingoDB


### Table of contents
* [Get started!](#create-app)
* [Usage overview](https://github.com/biggora/trinte/wiki/Command-format)
  * [Command format](https://github.com/biggora/trinte/wiki/Command-format)
  * [Create and initialize app](https://github.com/biggora/trinte/wiki/Create-App)
  * [Creates a Scaffold](https://github.com/biggora/trinte/wiki/Create-a-Scaffold)
  * [Creates a Model](https://github.com/biggora/trinte/wiki/Create-a-Model)
  * [Creates a Controller](https://github.com/biggora/trinte/wiki/Create-a-controller)
  * [Creates a View](https://github.com/biggora/trinte/wiki/Create-a-View)
  * [Creates a Rest](https://github.com/biggora/trinte/wiki/Create-a-Rest)
  * [Field types](https://github.com/biggora/trinte/wiki/Create-a-Model#field-types)
  * [Runs server](https://github.com/biggora/trinte/wiki/Runs-Server)
* [Created application](https://github.com/biggora/trinte/wiki/Application-configuration)
  * [Application configuration](https://github.com/biggora/trinte/wiki/Application-configuration)
  * [Database configuration](https://github.com/biggora/trinte/wiki/Application-configuration#database-configuration)
  * [Directory structure](https://github.com/biggora/trinte/wiki/Directory-Structure)
  * [Routing](https://github.com/biggora/trinte/wiki/Routes)
  * [Param pre-condition functions](https://github.com/biggora/trinte/wiki/Routes#wiki-param-pre-condition-functions)
  * [Middleware](https://github.com/biggora/trinte/wiki/Middleware)
  * [Application Helper](https://github.com/biggora/trinte/wiki/Helpers)
  * [Views Helper](https://github.com/biggora/trinte/wiki/Helpers#views-helper)
  * [Models Helper](https://github.com/biggora/trinte/wiki/Helpers#models-helper)
* [Examples](https://github.com/biggora/trinte/wiki/Examples)
  * [Database configuration](https://github.com/biggora/trinte/wiki/Examples#database-configuration)
  * [Authentication](https://github.com/biggora/trinte/wiki/Examples#authentication)
  * [Session](https://github.com/biggora/trinte/wiki/Examples#session)
  * [Multilingual support](https://github.com/biggora/trinte/wiki/Multilingual-support)
* [Recommend extensions](https://github.com/biggora/trinte/wiki/Recommend-Extensions)
* [Credits](#credits)
* [Peoject Author](#author)
* [Copyright & License](#license)
* [Resources](#resources)

<a name="usage"></a>
## Usage overview:

      $ trinte [command(s)] [argument(s)]

Command format detail [here](https://github.com/biggora/trinte/wiki/Command-format)

<a name="start"></a>
<a name="create-app"></a>
### Get started!

      $ trinte -i HelloWorld --sess   # Create application
      $ cd HelloWorld && npm install # intall dependencies

      # generate scaffold
      $ trinte -g crud User active:bool name email password about:text created:date
      $ trinte -s                   # running server (default in cluster mode)

  - Browse your application to [http://localhost:3000](http://localhost:3000)

Full params list [here](https://github.com/biggora/trinte/wiki/Create-App)

<a name="middleware"></a>
### Used Middleware

In generated trinte app used middleware and libraries:

  - [body-parser](https://github.com/expressjs/body-parser)
  - [connect-multiparty](https://github.com/andrewrk/connect-multiparty)
  - [compression](https://github.com/expressjs/compression)
  - [connect-timeout](https://github.com/expressjs/timeout)
  - [cookie-parser](https://github.com/expressjs/cookie-parser)
  - [csurf](https://github.com/expressjs/csurf)
  - [errorhandler](https://github.com/expressjs/errorhandler)
  - [express-session](https://github.com/expressjs/session)
  - [method-override](https://github.com/expressjs/method-override)
  - [morgan](https://github.com/expressjs/morgan)
  - [serve-static](https://github.com/expressjs/serve-static)
  - [static-favicon](https://github.com/expressjs/favicon)
  - [connect-flash](https://github.com/jaredhanson/connect-flash)
  - [express-useragent](https://github.com/biggora/express-useragent)
  - [express-params](https://github.com/visionmedia/express-params)
  - [connect-caminte](https://github.com/biggora/connect-caminte)
  
<a name="recommend"></a>
### Recommend extensions

- [CaminteJS](http://www.camintejs.com/) - Cross-db ORM for NodeJS
- [2CO](https://github.com/biggora/2co) - is the module that will provide nodejs adapters for 2checkout API payment gateway.
- [connect-caminte](https://github.com/biggora/connect-caminte) CrossDB Session Storage for Connect/Express.

<a name="in-the-wild"></a>
### In the Wild

The following projects use TrinteJS.

If you are using TrinteJS in a project, app, or module, get on the list below
by getting in touch or submitting a pull request with changes to the README.

<a name="startups-and-apps"></a>
### Startups & Apps

- [RVA](http://www.rva.lv/)
- [RK69](http://www.rk69.lv/)
- [TViMama](http://tvimama.com/)

<a name="credits"></a>
### Credits

- [Node.js](http://nodejs.org/): Amazing javascript asynchronous IO library, install manually.
- [NPM](http://npmjs.org/): Node package manager, used to install:
- [Express.Js](http://expressjs.com/): Application Framework for Node.js
- [Caminte.Js](http://camintejs.com/): Node.JS ORM for Any DB.
- [EJS](http://embeddedjs.com/): Embedded Javascript Templating Library.
- [jQuery](http://jquery.com/): Best Javascript Library.
- [Bootstrap](http://twitter.github.com/bootstrap/index.html): Powerful front-end CSS/JS framework.
- [Bootswatch](https://bootswatch.com/): Free themes for Bootstrap.
- [Font Awesome](https://fortawesome.github.io/Font-Awesome/): The iconic font and CSS toolkit.
- [Glyphicons](http://glyphicons.com/): Fantastic library of precisely prepared monochromatic icons and symbols.

<a name="author"></a>
### Author

Aleksej Gordejev (aleksej@gordejev.lv).

<a name="license"></a>
### Copyright & License

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
### Resources

- Visit the [author website](http://www.gordejev.lv).
- Follow [@biggora](https://twitter.com/#!/biggora) on Twitter for updates.
- Report issues on the [github issues](https://github.com/biggora/trinte/issues) page.

[![Analytics](https://ga-beacon.appspot.com/UA-22788134-5/trinte/readme)](https://github.com/igrigorik/ga-beacon)

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/biggora/trinte/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

