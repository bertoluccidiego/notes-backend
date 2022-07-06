const express = require('express');
const cors = require('cors');

const app = express();

function requestLogger(request, response, next) {
  console.log('Method', request.method);
  console.log('Path', request.path);
  console.log('Body', request.body);
  console.log('---');

  next();
}

function unknownEndpoint(request, response) {
  response.status(404).json({ error: 'unknown endpoint' });
}

app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.use(express.static('build'));

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2022-05-30T17:30:31.098Z',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2022-05-30T18:39:34.091Z',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2022-05-30T19:20:14.298Z',
    important: true,
  },
];

app.get('/', (request, response) => {
  response.end('<h1>Hello World</h1>');
});

app.get('/api/notes', (request, response) => {
  response.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((n) => n.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

app.post('/api/notes', (request, response) => {
  const { body } = request;

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' });
  }

  const note = {
    id: notes.length + 1,
    date: new Date().toISOString(),
    important: body.important || false,
    content: body.content,
  };
  notes = notes.concat(note);

  return response.json(note);
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
