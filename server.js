const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 3000;

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET ALL TODOS
app.get('/api/todos', (req, res) => {
  let data = '';
  fs.readFile(path.resolve(__dirname, 'data.json'), (err, resp) => {
    if (err) return console.log('Error::reading tasks from data.json file ', err);
    data = JSON.parse(resp);
    res.send(data.todos);
  });
});

// GET A TODO
app.get('/api/todos/:id', (req, res) => {
    fs.readFile(path.resolve(__dirname, 'data.json'), (err, resp) => {
      if (err) return console.log('Error::reading tasks from data.json file ', err);
      let data = JSON.parse(resp);
      let todoData = data.todos.filter(todo => todo.id === parseInt(req.params.id))
      if (todoData.length > 0) {
        res.status(200).send(todoData[0]);
      } else {
        res.status(500).send({ message: 'Error: not found any task with that id' });
      }
    });
});

// POST A TODO
app.post('/api/todo', (req, res) => {
  fs.readFile(path.resolve(__dirname, 'data.json'), (err, resp) => {
    if (err) return console.log('Error::reading tasks from data.json file ', err);
    const { id, task, status } = req.body
    if (id && task && status) {
      let json = JSON.parse(resp);
      json.todos.push(req.body);
      fs.writeFile(path.resolve(__dirname, 'data.json'), JSON.stringify(json), err => {
        if (err) return console.log('Error::writing task to the data.json file ', err);
      });
      res.status(200).send({ message: 'Success: data have been added' });
    } else {
      res.status(500).send({ message: 'Error: all fields must be filled with data' })
    }
  });
});

// EDIT A TODO
app.put('/api/todo/:id', (req, res) => {
    fs.readFile(path.resolve(__dirname, 'data.json'), (err, resp) => {
      if (err) return console.log('Error::reading tasks from data.json file ', err);
      const id = parseInt(req.params.id)
      const { task, status } = req.body
      if (task && status) {
        let json = JSON.parse(resp);
        let newTodo = json.todos.map(todo => {
          if(todo.id === id) {
            return {
                id,
                task,
                status
            }
          } else {
              return todo
          }
        })
        let result = {
            todos: newTodo
        }
        fs.writeFile(path.resolve(__dirname, 'data.json'), JSON.stringify(result), err => {
          if (err) return console.log('Error::editing task to the data.json file ', err);
          res.status(200).send({ message: 'Success: task have been edited' });
        });
      } else {
        res.status(500).send({
          message: 'Error: all fields must be filled with data'
        })
      }
    });
});

// DELETE A TODO
app.delete('/api/todo/:id', (req, res) => {
    fs.readFile(path.resolve(__dirname, 'data.json'), (err, resp) => {
      if (err) return console.log('Error::reading tasks from data.json file ', err);
      let json = JSON.parse(resp);
      let isDataExist = json.todos.some(todo => todo.id === parseInt(req.params.id))
      if (isDataExist) {
        let leftTodo = json.todos.filter(todo => todo.id !== parseInt(req.params.id))
        let result = {
            todos: leftTodo
        }
        fs.writeFile(path.resolve(__dirname, 'data.json'), JSON.stringify(result), err => {
          if (err) return console.log('Error::deleting task to the data.json file ', err);
          res.status(200).send({ message: 'Success: a task has been deleted' });
        });
      } else {
        res.status(500).send({ message: 'Error: a task you want to delete is not exist' })
      }
    });
});

app
  .listen(port, () => {
    console.info(`Your api server is running on http://localhost:${port}`);
  })
  .on('error', () => {
    console.error('Error::server ', error);
  });