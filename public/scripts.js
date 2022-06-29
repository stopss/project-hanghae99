const socket = io('/chattings');

function submitButton() {
  socket.on('submit_chat', chat_message_input.value);
}

socket.emit('new_chat', (data) => {
  console.log(data);
});
