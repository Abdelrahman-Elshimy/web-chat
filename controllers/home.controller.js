exports.getHome = (req, res, next) => {
    res.render('index', {
        pageTitle: 'Chat',
        isUser: req.session.userId,
        username: req.session.name,
        image: req.session.image,
        friendRequests: req.friendRequests.friendRequests,
    });
}