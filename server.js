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

app.get('/api/todos', (req, res) => {
  let data = '';
  fs.readFile(path.resolve(__dirname, 'data.json'), (err, resp) => {
    if (err) return console.log('Error::reading tasks from data.json file ', err);
    data = JSON.parse(resp);
    res.send(data.todos);
  });
});

app.get('/api/todos/:id', (req, res) => {
    let data = '';
    fs.readFile(path.resolve(__dirname, 'data.json'), (err, resp) => {
      if (err) return console.log('Error::reading tasks from data.json file ', err);
      data = JSON.parse(resp);
      res.send(data.todos);
    });
  });

app.post('/api/todo', (req, res) => {
  fs.readFile(path.resolve(__dirname, 'data.json'), (err, resp) => {
    if (err) return console.log('Error::reading tasks from data.json file ', err);
    let json = JSON.parse(resp);
    json.todos.push(req.body);
    fs.writeFile(path.resolve(__dirname, 'data.json'), JSON.stringify(json), err => {
      if (err) return console.log('Error::writing task to the data.json file ', err);
    });
  });
  res.send({ message: 'Success' });
});

app.put('/api/todo/:id', (req, res) => {
    fs.readFile(path.resolve(__dirname, 'data.json'), (err, resp) => {
      if (err) return console.log('Error::reading tasks from data.json file ', err);
      let json = JSON.parse(resp);
      const id = parseInt(req.params.id)
      const { task, status } = req.body
      let newTodo = json.todos.map(todo => {
          if(todo.id !== id) {
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
      });
    });
    res.send({ message: 'Success' });
});

app.delete('/api/todo/:id', (req, res) => {
    fs.readFile(path.resolve(__dirname, 'data.json'), (err, resp) => {
      if (err) return console.log('Error::reading tasks from data.json file ', err);
      let json = JSON.parse(resp);
      let leftTodo = json.todos.filter(todo => todo.id !== parseInt(req.params.id))
      let result = {
          todos: leftTodo
      }
      fs.writeFile(path.resolve(__dirname, 'data.json'), JSON.stringify(result), err => {
        if (err) return console.log('Error::deleting task to the data.json file ', err);
      });
    });
    res.send({ message: 'Success' });
});

app
  .listen(port, () => {
    console.info(`Your api server is running on http://localhost:${port}`);
  })
  .on('error', () => {
    console.error('Error::server ', error);
  });