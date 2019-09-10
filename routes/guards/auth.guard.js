exports.isAuth  = (req, res, next) => {
    if (!req.session.userId) res.redirect('/login') 
    else next();
}
exports.isNotAuth  = (req, res, next) => {
    if (req.session.userId) res.redirect('/') 
    else next();
}