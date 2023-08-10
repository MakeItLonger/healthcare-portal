const mongoose = require('mongoose');

const app = require('./app');

const http = require('http').createServer();

const chatService = require('./services/chat')

const io = require('socket.io')(http, {
  cors: { origin: '*' },
});

const activeDoctors = []

io.on('connection', async (socket) => {

  let roomId = 'default'

  socket.on('join', (doctorId) => {
    console.log(doctorId + ' is online')
    if (activeDoctors.indexOf(doctorId) < 0){
      activeDoctors.push(doctorId)
    }
    console.log(activeDoctors)
  });

  socket.on('leave', (doctorId) => {
    console.log(doctorId + ' logged out')
    activeDoctors.slice(activeDoctors.indexOf(doctorId), 1)
  });

  socket.on('ping', invite => {
    io.to(invite.id).emit('enter', invite.conv)
  });

  socket.on('getOnline', () => {
    io.emit('activeDoctors', activeDoctors)
  });

  socket.on('joinRoom', (room) => {
    socket.join(room);
    roomId = room;
  });

  socket.on('message', body => {
    console.log(body)
    const {chatId, id, msg} = body
    io.to(chatId).emit('message', { sender: id, msg: msg })
    chatService.addMessage(chatId, id, msg)
  });
});

http.listen(3030, () => {
  console.log('Chat API: ON');
});

mongoose.set('strictQuery', true);

const { DB_HOST, PORT = 3000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log('Database connection successful');
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
