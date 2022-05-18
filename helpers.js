exports.isLogged = (req, res, next) => {
    if(!req.user) {res.json({msg: "You are not loggeed in"})}
    next();
}

