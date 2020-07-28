const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const morgan = require('morgan');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

const auth = require('./routes/auth');
const home = require('./routes/home');
const users = require('./routes/users');
const exerciseCategory = require('./routes/exercisesCategory');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json())

if (app.get('env') === 'development') {
  morgan('tiny');
  startupDebugger.enabled = true;
  dbDebugger.enabled = true;
}

app.use('/api/exerciseCategory', exerciseCategory);
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/', home);

// desbuggers
startupDebugger('Application name:', config.get('name'));

mongoose.connect('mongodb://localhost/behealthy', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    dbDebugger('Connected to database')
    app.listen(PORT, () => startupDebugger(`Listening to PORT ${PORT}`));
  })
  .catch(error => dbDebugger('Couldn\'t connect to database'))