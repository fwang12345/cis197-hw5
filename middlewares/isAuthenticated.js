/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
var isAuthenticated = function(req, res, next) {
    if (req.session.username) {
        return next()
    } else {
        res.redirect('/account/login')
    }
}

module.exports = isAuthenticated
