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

// eslint-disable-next-line
function errorHandler(error, request, response, next) {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
