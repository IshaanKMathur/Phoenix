// Extract the group name from the URL path
const groupName = window.location.pathname.split("/").pop();

// Initialize the socket connection with the group name
const socket = io({ path: "/socket.io", query: `groupName=${groupName}` });


const inboxPeople=document.querySelector(".inbox__people");
let userName="";

window.addEventListener('message', function (event) {
    if (event.origin === 'http://localhost:3000') {
      const receivedData = event.data;
      console.log('Received username:', receivedData);
    } else {
      console.log('Error');
    }
  });
  

const newUserConnected=(user)=>{
    userName= user || `User${Math.floor(Math.random()*100)}`;
    socket.emit("new user",userName);
    addToUsersBox(userName);
};

const addToUsersBox=(userName)=>{
    if(!!document.querySelector(`.${userName}-userlist`)){
        return;
    }

    const userBox=`
    <div class="chat_ib ${userName}-userlist">
    <h5>${userName}</h5>
    </div>
    `;
    inboxPeople.innerHTML+=userBox;
};

newUserConnected();

socket.on("new user", function(data){
    data.map((user)=>addToUsersBox(user));
});

socket.on("user disconnected",function(userName){
    document.querySelector(`.${userName}-userlist`).remove();
});

const inputField=document.querySelector(".message_form__input");
const messageForm=document.querySelector(".message_form");
const messageBox=document.querySelector(".messages__history");
const fallback=document.querySelector(".fallback");

const addNewMessage=({user, message})=>{
    const time=new Date();
    const formattedTime=time.toLocaleString("en-US",{hour:"numeric", minute:"numeric"});

    const receivedMsg=`
    <div class="incoming__message">
        <div class="received__message">
            <p>${message}</p>
            <div class="message__info">
                <span class="message__author">${user}</span>
                <span class="time_date">${formattedTime}</span>
            </div>
        </div>
    </div>`;

const myMsg=`
<div class="outgoing__message">
    <div class="received__message">
        <p>${message}</p>
        <div class="message__info">
            <span class="message__author">you</span>
            <span class="time_date">${formattedTime}</span>
        </div>
    </div>
</div>`;

messageBox.innerHTML+=user===userName?myMsg :receivedMsg;
}

messageForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(!inputField.value){
        return;
    }

    socket.emit("chat message",{
        message: inputField.value,
        nick: userName,
    });
    inputField.value="";
});

socket.on("chat message", function(data){
    addNewMessage({
        user: data.nick,
        message: data.message});
});

socket.on("typing",function(data){
    const{isTyping,nick}=data;
    if(!isTyping){
        fallback.innerHTML="";
        return;
    }

    fallback.innerHTML=`<p>${nick} is typing...</p>`;
})