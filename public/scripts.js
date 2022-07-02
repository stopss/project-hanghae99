const socket = io('/chattings');

const getElementById = (id) => document.getElementById(id) || null;
const chattingBoxElement = getElementById('chatting_box');
const formElement1 = getElementById('chat_form');
const formElement2 = getElementById('join_room');

socket.on('new_chat', (data) => {
  const { message } = data;
  drawChat(message);
});

const handleSubmit = (event) => {
  event.preventDefault();
  const message = event.target.elements[0].value;
  const url = '/rooms/11'; // /api/rooms/:roomId
  const payload = {
    message,
    url,
  };
  socket.emit('submit_chat', payload);
  drawChat(message, true);
  event.target.elements[0].value = '';
};

const drawChat = (chat, bool = false) => {
  const wrapperChatBox = document.createElement('div');
  wrapperChatBox.className = 'clearfix';
  let chatBox;
  if (!bool)
    chatBox = `<div style="background-color: green; border: 1px solid white;">${chat}</div>`;
  else
    chatBox = `<div class='bg-white w-3/4 ml-auto mr-4 my-2 p-2 rounded-lg clearfix break-all'>${chat}</div>`;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

const joinTheRoom = (event) => {
  event.preventDefault();
  console.log('join the room');
};

function init() {
  formElement1.addEventListener('submit', handleSubmit);
  formElement2.addEventListener('submit', joinTheRoom);
}

init();
