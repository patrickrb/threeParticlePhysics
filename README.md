Built with [Angular][1] and [Three.js][2]


I simplified the following [codepen][3] so that I could better understand how to implement particle physics into Three.js/webgl  
## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and NPM](nodejs.org) >= v5.1.0
- [Bower](bower.io) (`npm install --global bower`)
- [Ruby](https://www.ruby-lang.org) and then `gem install sass`
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `npm install` to install server dependencies.

2. Run `bower install` to install front-end dependencies.

3. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

4. Run `grunt serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `grunt build` for building and `grunt serve` for preview.

## Testing

Running `npm test` will run the unit tests with karma.


[1]: https://angularjs.org/
[2]: http://threejs.org/
[3]: http://codepen.io/Grilly86/pen/GBaCE
