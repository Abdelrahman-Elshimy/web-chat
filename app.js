const express = require('express');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);


// routes
const AuthRoutes = require('./routes/auth.routes');
const ProfileRoutes = require('./routes/profile.routes');
const FriendRoutes = require('./routes/friend.routes');

const app = express();
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

app.use(flash());

app.use(AuthRoutes);
app.use("/profile", ProfileRoutes);
app.use("/friend", FriendRoutes);


app.use((req, res, next) => {
    res.status(404);
    res.render('404', {
        pageTitle: '404'
    });
});

const port = process.env.PORT || 3000;


// listen
app.listen(port, (err) => {
    console.log('server listen to port ' + 3000);
});






