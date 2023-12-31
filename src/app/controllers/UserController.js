const User = require('../models/User');

const passport = require('passport');
const bcrypt = require('bcrypt');

class UserController {
    // [GET] /users/login
    login(req, res, next) {
        res.render('login');
    }

    // [POST] /users/register
    register(req, res, next) {
        res.render('register');
    }

    // [POST] /users/login
    get_in(req, res, next) {
        const { email, password } = req.body;

        User.findOne({ email: email })
            .then((data) => {
                if (data !== null) {
                    const myPlaintextPassword = password;
                    bcrypt.compare(
                        myPlaintextPassword,
                        data.password,
                        function (err, result) {
                            if (result) {
                                req.session.user = data.name;
                                req.session.email = data.email;
                                req.session.userId = data._id;
                                res.redirect('/todo');
                            } else {
                                res.render('login', {
                                    message: 'Wrong password',
                                    messageClass: 'alert-danger',
                                });
                            }
                        },
                    );
                } else {
                    res.render('login', {
                        message: 'Wrong email',
                        messageClass: 'alert-danger',
                    });
                }
            })
            .catch((err) => {
                next(err);
            });
    }

    // [POST] /users/register
    create_user(req, res, next) {
        try {
            let { name, email, password, confirmPassword } = req.body;
            if (
                name == '' ||
                email == '' ||
                password == '' ||
                confirmPassword == ''
            ) {
                res.render('register', {
                    message: 'Input Name, Email and Password!',
                    messageClass: 'alert-danger',
                });
                return;
            }
            if (password.length < 6 || confirmPassword < 6) {
                res.render('register', {
                    message: 'Password must be at least 6 characters',
                    messageClass: 'alert-danger',
                });
                return;
            }
            if (password === confirmPassword) {
                User.findOne({ email: email })
                    .then((data) => {
                        if (data === null) {
                            const saltRounds = 10;
                            const salt = bcrypt.genSaltSync(saltRounds);
                            const myPlaintextPassword = password;
                            bcrypt.hash(
                                myPlaintextPassword,
                                salt,
                                function (err, hash) {
                                    const new_user = {
                                        name,
                                        email,
                                        password: hash,
                                    };

                                    const savetoDB = new User(new_user);
                                    savetoDB.save();
                                    res.render('login', {
                                        message:
                                            'Registration Complete. Please login to continue.',
                                        messageClass: 'alert-success',
                                    });
                                },
                            );
                        } else {
                            res.render('register', {
                                message: 'Email have already been registered',
                                messageClass: 'alert-danger',
                            });
                        }
                    })
                    .catch((err) => {
                        next(err);
                    });
            } else {
                res.render('register', {
                    message: 'Password does not match.',
                    messageClass: 'alert-danger',
                });
                return;
            }
        } catch (err) {
            console.log(err);
        }
    }

    // [GET] /users/logout
    logout(req, res, next) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).send('Internal Server Error');
            } else {
                // Redirect to the login page or any other desired page after logout
                res.redirect('/');
            }
        });
    }

    get_delete(req, res, next) {
        const user = req.session.user;
        const email = req.session.email;
        const user_id = req.session.userId;

        res.render('delete', {
            user: user,
            email: email,
        });
    }

    delete_acc(req, res, next) {
        const user = req.session.user;
        const email = req.session.email;
        const user_id = req.session.userId;

        const result = req.body.resp;

        if (result === 'no') {
            res.redirect('/todo');
        } else {
            User.deleteOne({ _id: user_id })
                .then(() => {
                    req.session.destroy((err) => {
                        if (err) {
                            console.error('Error destroying session:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            // Redirect to the login page or any other desired page after logout
                            res.redirect('/');
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    get_edit(req, res, next) {
        const user = req.session.user;
        const email = req.session.email;
        const user_id = req.session.userId;

        res.render('edit_user', {
            user: user,
            email: email,
        });
    }

    edit_user(req, res, next) {
        const user_id = req.session.userId;

        const { name, email } = req.body;

        User.findByIdAndUpdate(user_id, { name, email }, { new: true })
            .then((data) => {
                req.session.user = data.name;
                req.session.email = data.email;
                req.session.userId = data._id;
                res.redirect('/todo');
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

module.exports = new UserController();
