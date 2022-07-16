const Note = require('../models/note');

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
];

async function nonExistingId() {
  const note = new Note({ content: 'willremovethissoon', date: new Date() });
  await note.save();
  await note.remove();

  /* eslint-disable-next-line */
  return note._id.toString();
}

async function notesInDb() {
  const notes = await Note.find({});
  return notes.map((note) => note.toJSON());
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
};
