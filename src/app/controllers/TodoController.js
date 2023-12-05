const User = require('../models/User');
const moment = require('moment-timezone');
const mongoose = require('mongoose');

moment.tz.setDefault('Asia/Ho_Chi_Minh').locale('id');

class TodoController {
    // [GET] /todo
    index(req, res, next) {
        const user = req.session.user;
        const email = req.session.email;

        User.findOne({ email: email })
            .then((data) => {
                res.render('todo/index', {
                    user: user,
                    todos: data.todo,
                });
            })
            .catch((err) => {
                next(err);
            });
    }

    // [GET] /todo/add
    addTodo(req, res, next) {
        const user = req.session.user;
        const email = req.session.email;

        res.render('todo/add', {
            user: user,
        });
    }

    // [POST] /todo
    createTodo(req, res, next) {
        const user = req.session.user;
        const email = req.session.email;
        const user_id = req.session.userId;

        const { title, dueDate } = req.body;
        const time = moment(Date.now()).format('DD/MM HH:mm:ss');
        const newTodoItem = {
            user: user,
            title: title,
            dueDate: dueDate,
            time: time,
            _id: new mongoose.Types.ObjectId(),
        };

        User.findOne({ _id: user_id })
            .then((data) => {
                data.todo.push(newTodoItem);
                data.save();
                res.redirect('/todo');
            })
            .catch((err) => {
                next(err);
            });
    }

    // [GET] /todo/edit/:id
    editTodo(req, res, next) {
        const user = req.session.user;
        const email = req.session.email;
        const user_id = req.session.userId;
        let todoId = req.params.id;

        User.findOne({ email: email }).then((data) => {
            let arr = data.todo;

            let index = arr.findIndex((x) => x._id == todoId);

            res.render('todo/edit', {
                user: user,
                todoTitle: arr[index].title,
                todoDueDate: arr[index].dueDate,
                _id: arr[index]._id,
            });
        });
    }

    // [POST] /todo/edit/
    saveEditTodo(req, res, next) {
        res.json({ test: req.body });
    }
}

module.exports = new TodoController();
