const createError = require('http-errors');
const express = require('express');
const morgan = require('morgan');

const cors = require('cors');
const path = require('path');
const winston = require('./config/winston');
const apiRouter = require('./routes/api');

const app = express();

app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api', apiRouter);

// Serve React app
const buildPath = path.join(__dirname, '..', '..', 'frontend', 'build');
app.use(express.static(buildPath));
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
