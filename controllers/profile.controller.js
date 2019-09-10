const userModel = require('../models/user.model');

exports.redirect = (req, res, next) => {
    res.redirect("/profile/"+ req.session.userId);
}

exports.getProfile = (req, res, next) => {
    userModel.getUser(req.params.id).then((user) => {
        res.render('profile', {
            pageTitle: user.username,
            isUser: true,
            username: user.username,
            image: user.image,
            id: req.params.id,
            myId: req.session.userId,
            myName: req.session.name,
            myImage: req.session.image,
            isOwner: req.params.id === req.session.userId,
            isFriends: user.friends.find(friend => friend.id === req.session.userId),
            isRequestSent: user.friendRequests.find(friend => friend.id === req.session.userId),
            isRequestRecieved: user.sendRequests.find(friend => friend.id === req.session.userId),
        });
    }).catch((err) => {
        res.send(err);
        console.log('error');
    });
}