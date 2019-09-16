const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);
const getFrienRequests = require('./models/user.model').getFriendRequests;
const socketIO = require('socket.io');

// routes
const AuthRoutes = require('./routes/auth.routes');
const ProfileRoutes = require('./routes/profile.routes');
const FriendRoutes = require('./routes/friend.routes');
const homeRoutes = require('./routes/home.routes');


const app = express();
const server = require('http').createServer(app);
const io = socketIO(server);

io.onlineUsers = {}
require('./sockets/init.socket')(io);
require('./sockets/friend.socket')(io);
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'images')));

// view engine
app.set('view engine', 'ejs');

const Store = new SessionStore({
    uri: 'mongodb://localhost:27017/chat',
    collection: 'sessions'
});

app.use(session({
    secret: 'chat app secret',
    saveUninitialized: false,
    store: Store,
    resave: true
}));

app.use((req, res, next) => {
    if (req.session.userId) {
        getFrienRequests(req.session.userId).then((requests) => {
            req.friendRequests = requests;
            next();
        }).catch((err) => {
            res.redirect("/error");
        });

    } else {
        next();
    }
});

app.use(flash());


app.use(AuthRoutes);
app.use("/profile", ProfileRoutes);
app.use("/friend", FriendRoutes);
app.use(homeRoutes);



app.use((req, res, next) => {
    res.status(404);
    res.render('404', {
        pageTitle: '404',

    });
});

const port = process.env.PORT || 3000;


// listen
server.listen(port, (err) => {
    console.log('server listen to port ' + 3000);
});






