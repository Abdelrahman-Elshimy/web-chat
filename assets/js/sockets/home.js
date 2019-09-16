
socket.emit('getOnlineFriends', id);

socket.on('onlineFriends', friends => {
    let div = document.getElementById('onlineFriends');
    if(friends.length === 0) {
        div.innerHTML = '<div class="badget badget-danger"> No Online Users </div>';
    }
    else {
        let html = `<div class="row">`;

        for(let friend of friends) {
            html += `
                <div class="div-sm-12 col-md-6 col-lg-4"> 
                <img src="/${friend.image}" width="50px">
                <div>
                    <h3> ${friend.name} </h3>
                    <span>Chat</span>
                </div>
                </div>
            `;
        }
        html += `</div>`

        div.innerHTML = html;
    }
});