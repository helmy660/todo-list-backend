'use strict'

const { EventEmitter } = require('events');
const server = require('./server/server');
const repository = require('./repository/repository');
const config = require('./config/config');
const connection = require('./config/connection');
const mediator = new EventEmitter();

mediator.on('db.ready', (Pool) => {
  let repo;
  repository(Pool).then((repository) => {
    repo = repository;
    server({
      port: config.serverSettings.port,
      repo
    }).then(app => {
      console.log(`MicroService has started succesfully, running on port: ${config.serverSettings.port}.`);
    })
  })
})

mediator.on('db.error', (err) => {
  console.error(err);
})


connection(config, mediator);