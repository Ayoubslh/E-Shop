const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { createServer } = require('node:http');
const {Server} = require('socket.io');



const port = process.env.PORT || 3000;



process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config( );
const app = require('./app');
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust this to your frontend URL for better security
    methods: ['GET', 'POST'],
  },
});

DB=process.env.MONGODB_URI;

mongoose
  .connect(DB, )
  .then(() => console.log('DB connection successful!'));




io.on('connection', (socket) => {
  console.log('New client connected')

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
})



 server.listen(port, () => {
  console.log(`App running on port ${port}...`);
  
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});