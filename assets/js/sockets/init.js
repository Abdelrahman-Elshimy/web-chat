const socket = io();

socket.on('connect', () => {
     let id = document.getElementById('userId').value;
     socket.emit('joinNotificationsRoom', id);
});
socket.on('newFriendRequest', data => {
     const frienRequests = document.getElementById('frienRequests');
     const span = frienRequests.querySelector('span');
     if (span) span.remove();
     frienRequests.innerHTML += `
     <a class="dropdown-item" href="${data.id}">${data.name}</a>
     `;

     const friendRequestsDropDown = document.getElementById('friendRequestsDropDown');
     friendRequestsDropDown.classList.remove('btn-primary');
     friendRequestsDropDown.classList.add('btn-danger');
     friendRequestsDropDown.onclick = () => {
          friendRequestsDropDown.classList.add('btn-primary');
     friendRequestsDropDown.classList.remove('btn-danger');
     }
});