const socket = io('/chattings');

const getElementById = (id) => document.getElementById(id) || null;
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

socket.on('new_chat', (data) => {
  const { chat } = data;
  console.log(chat);
  drawChat(chat);
});

const handleSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  socket.emit('submit_chat', inputValue);
  drawChat(inputValue, true);
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

function init() {
  formElement.addEventListener('submit', handleSubmit);
}

init();
