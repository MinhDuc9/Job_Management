module.exports = {
    isAuthenticated: function (req, res, next) {
        const user = req.session.user;
        const email = req.session.email;
        const user_id = req.session.userId;

        if (email !== undefined) {
            return next();
        }
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger',
        });
    },

    isAuthenticatedAdmin: function (req, res, next) {
        const admin = req.session.admin;
        const email = req.session.email;
        const admin_id = req.session.admin_id;

        if (email !== undefined) {
            return next();
        }
        res.render('login_admin', {
            message: 'Please login to continue',
            messageClass: 'alert-danger',
        });
    },
};
