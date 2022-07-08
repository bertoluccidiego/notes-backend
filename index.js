require('dotenv').config();
const express = require('express');
const cors = require('cors');

const Note = require('./models/note');

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

function errorHandler(error, request, response, next) {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' });
  }

  next(error);
}

app.use(express.static('build'));
app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.get('/', (request, response) => {
  response.end('<h1>Hello World</h1>');
});

app.get('/api/notes', (request, response) => {
  Note.find({}).then((fetchedNotes) => {
    response.json(fetchedNotes);
  });
});

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      }

      return response.status(404).end();
    })
    .catch((error) => {
      next(error);
      console.log(error);
      response.status(400).json({ error: 'malformatted id' });
    });
});

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// eslint-disable-next-line
app.post('/api/notes', (request, response) => {
  const { body } = request;

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' });
  }

  const newNote = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  newNote.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.put('/api/notes/:id', (request, response, next) => {
  const { body } = request;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
