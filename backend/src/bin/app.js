const createError = require('http-errors');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const errorHandler = require('../util/middlewares/error')
const apiRouter = require('./routes/api');
const app = express();

app.use(morgan(':date[web] :remote-addr -> :status :method :url - :response-time ms'));
app.use(morgan(':date[web] :remote-addr -> :status :method :url - :response-time ms', {
  stream: fs.createWriteStream(path.join(__dirname, '..', '..', 'logs', 'access.log'), { flags: 'a' })
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routing
app.use('/api', apiRouter);
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});
app.use((req, res, next) => {
  next(createError(404));
});

// Error
app.use(errorHandler);

module.exports = app;
