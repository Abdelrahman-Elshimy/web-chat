exports.getHome = (req, res, next) => {
    res.render('index', {
        pageTitle: 'Chat',
        isUser: req.session.userId,
        friendRequests: req.friendRequests.friendRequests,
    });
}