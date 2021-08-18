var user = require('../model/user');
let jwt = require('jsonwebtoken');


module.exports.checkAdmin = async (req, res, next) => {
    var findAdmin = await user.findOne({_id: req.signedCookies.id});
    if (findAdmin) {
        if (findAdmin.role == "Admin") {
            next();
        } else {
            return res.redirect('/users/info/' + req.signedCookies.id);

        }
    } else {
        return res.redirect('/users/info/' + req.signedCookies.id);
    }
}

module.exports.reqAuth = async (req, res, next) => {
    if (req.signedCookies.id) {
        var findUser = await user.findOne({_id: req.signedCookies.id});
        if (findUser) {
            res.locals.findUser = findUser;
            res.locals.role = findUser.role;
            next();
        } else {
            return res.redirect('/');

        }
    } else {
        return res.redirect('/');

    }
}
module.exports.verifyToken = async (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        try {
            const decoded = await jwt.verify(req.headers.authorization, 'duan');
            req.jwtDecoded = decoded;
            next();
        } catch (e) {
            throw new Error(e);
        }
        // (err, decoded) => {
        //     if (err) {
        //         res.status(500).json({error: err.message})
        //     }
        //     if (decoded) {
        //         user.findOne({_id: decoded.id}).then(data => {
        //             if (data.role === 'Admin') {
        //                 next();
        //             }
        //         });
        //
        //     }
        // }
    // )
    } else {
        res.status(500).json({message: 'Authentication error. Token required'});
    }
}
