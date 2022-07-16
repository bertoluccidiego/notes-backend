const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

notesRouter.get('/:id', (request, response, next) => {
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

notesRouter.post('/', async (request, response) => {
  const { body } = request;

  const newNote = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  const savedNote = await newNote.save();
  response.status(201).json(savedNote);
});

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body;

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
