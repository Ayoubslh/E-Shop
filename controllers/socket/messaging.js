module.exports = (socket, io) => {
  socket.on('send-message', ({ room, message, sender }) => {
    console.log(`Message in ${room} from ${sender}: ${message}`);
    
    // Broadcast message to the room
    socket.to(room).emit('receive-message', { sender, message });
  });

  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });
};
