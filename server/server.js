const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
var cors = require('cors');
const todoAPI = require('../api/todo');


module.exports = (options) => {
  return new Promise((resolve, reject) => {

    // we need to verify if we have a repository added and a server port
    if (!options.port) {
      reject(new Error('The server must be started with an available port'))
    }
    if (!options.repo) {
      reject(new Error('The server must be started with a connected repository'));
    }

    // init an express app and add some middlewares
    const app = express();
    app.use(cors());
    app.use(morgan("dev"));
    app.use(helmet());
    app.use(express.urlencoded());
    app.use(express.json());

    app.use((err, req, res, next) => {
      reject(new Error('Something went wrong!, err:' + err));
      res.status(500).send('Something went wrong!');
    })

    // add API's to the express app
    todoAPI(app, options);

    // finally start the server, and return the created server 
    const server = app.listen(process.env.PORT ||options.port, () => resolve(server));
  })
}