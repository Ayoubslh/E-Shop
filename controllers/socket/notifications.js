module.exports = (socket, io) => {
  // Listen for notification events
  socket.on('send-notification', (data) => {
    console.log('Notification sent:', data);
    
    // Emit to a specific user or broadcast
    io.emit('receive-notification', {
      title: data.title,
      message: data.message,
    });
  });
};
