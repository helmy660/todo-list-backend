'use strict'
const status = require('http-status');

module.exports = (app, options) => {
  const { repo } = options;

  // to create database required tables instead of create it manually
  app.post('/tables', (req, res) => {
    repo.createTables()
    .then(payme => {
        res.status(status.OK).json(payme);
    })
  })
  
  // to check credentials
  app.post('/login',(req, res) => {
    repo.checkLogin(req.body.user)
    .then(user => {
      res.status(status.OK).json(user);
    })
  }) 
  
  // to check existence of email,username in signup
  app.post('/signup',(req, res) => {
    repo.checkSignUp(req.body.user)
    .then(user => {
      res.status(status.OK).json(user);
    })
  })

  // to create an account for a user
  app.post('/user',(req, res) => {
    repo.createUser(req.body.user)
    .then(user => {
      res.status(status.OK).json(user);
    })
  })

  
  // to get all todos for a user
  app.get('/user/:userID/todos',(req,res)=>{
    repo.getUserTodos(req.params.userID)
    .then(result => {
      res.status(status.OK).json(result)      
    })
  })

  // to create new todo item
  app.post('/user/:userID/todo',(req,res)=>{
    repo.createTodo(req.params.userID, req.body.todo)
    .then(result => {
      res.status(status.OK).json(result)      
    })
  })

  // to delete a todo item
  app.delete('/user/:userID/todo/:ID',(req,res)=>{
    repo.removeTodo(req.params.userID, req.params.ID)
    .then(result => {
      res.status(status.OK).json(result)      
    })
  })

  // to update a todo item
  app.put('/user/:userID/todo/:ID',(req,res)=>{
    repo.updateTodo(req.params.userID, req.params.ID)
    .then(result => {
      res.status(status.OK).json(result)      
    })
  })
  
}