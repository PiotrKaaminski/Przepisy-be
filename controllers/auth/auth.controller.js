const db = require("../../models");
const ROLES = db.ROLES;
const config = require("../../config/auth.config");
const User = db.user;


var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    let user = req.body;
    // verify signup
    console.log("start verifying signup");
    // check if username is passed;
    if (!user.username) {
        console.error("Username cannot be empty");
        res.status(400).send({
            message: "Username cannot be empty"
        });
        return;
    }
    // check if username is unique
    User.findOne({
        where: {
            username: user.username
        }
    }).then(user => {
        if (user) {
            console.error("Username already in use");
            res.status(400).send({
                message: "Failed! Username is already in use!"
            });
            return true;
        }
        return false;
    }).then(error => {
        if (error) {
            return;
        }
        console.log("check if password is passed");
        if (!user.password) {
            console.error("Password cannot be empty");
            res.status(400).send({
                message: "Password cannot be empty"
            });
            return;
        }
        console.log("check if first name is passed");
        if (!user.firstName) {
            console.error("First name cannot be empty");
            res.status(400).send({
                message: "First name cannot be empty"
            });
            return;
        }
        console.log("check if last name is passed");
        if (!user.lastName) {
            console.error("Last name cannot be empty");
            res.status(400).send({
                message: "Last name cannot be empty"
            });
            return;
        }
        console.log("check if role is passed and exists");
        if (user.role) {
            if (!ROLES.includes(user.role)) {
                res.status(400).send({
                    message: "Failed! Role does not exist = " + user.role + ". Allowed values: " + ROLES
                });
                return;
            }
        } else {
            res.status(400).send({
                message: "Failed! No role passed"
            });
            return;
        }
        console.log("Save User to Database");
        User.create({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            password: bcrypt.hashSync(user.password, 10)
        }).then(user => {
            if (user.role === "admin") {
                user.setRoles([1, 2]).then(() => {
                    res.send({ message: "User was registered successfully!" });
                });
            } else {
                user.setRoles([1]).then(() => {
                    res.send({ message: "User was registered successfully!" });
                });
            }
        })
            .catch(err => {
                console.log(err);
                res.status(500).send({ message: err.message });
            });
    });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        var token = jwt.sign({ id: user.id }, config.jwtSecret, {
            expiresIn: 86400 // 24 hours
        });

        var authorities = [];
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: token
            });
        });
    }).catch(err => {
            res.status(500).send({ message: err.message });
        });
};
