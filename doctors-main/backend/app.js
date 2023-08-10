const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const doctorsRouter = require('./routes/doctors.js');
const adminsRouter = require('./routes/admins.js');
const newsRouter = require('./routes/news.js');
const servicesRouter = require('./routes/services.js');
const authRouter = require('./routes/patients.js');
const pendingRegistrationRouter = require('./routes/registrationPending');
const appointmentsRouter = require('./routes/appointments');
const chatRouter = require('./routes/chat');

require('dotenv').config();

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(logger(formatsLogger));
app.use(cors());

app.use(express.static('public'));

app.use('/api/doctors', doctorsRouter);
app.use('/api/admins', adminsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/news', newsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/auth', authRouter);
app.use('/api/pending', pendingRegistrationRouter);
app.use('/api/chat', chatRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
