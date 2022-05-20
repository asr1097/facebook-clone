exports.isLogged = (req, res, next) => {
    if(!req.user) {
        res.redirect("/auth/facebook")
    }
    next();
};

