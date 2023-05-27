const express = require('express');
const cors = require("cors");
const db = require("./models");


//const usersRouter = require('./routes/users');

const app = express();

const corsOptions = {origin: "*"};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.json(
        {
            message: "application running"
        }
    );
})
require("./routes/auth.routes")(app);
require("./routes/recipe.routes")(app);
require("./routes/image.routes")(app);

const Role = db.role;
const User = db.user;

// force / alter
db.sequelize.sync({alter: true}).then(() => {
    Role.count().then(count => {
        if (count === 0) {
            console.log("start initializing db with roles and users");
            initializeDB();
        }
    });
})

var bcrypt = require("bcryptjs");

function initializeDB() {
    Role.create({
        id: 1,
        name: "user"
    });
    Role.create({
        id: 2,
        name: "admin"
    });

    User.create( {
        username: "user",
        firstName: "Piotr",
        lastName: "Kaminski",
        password: bcrypt.hashSync("user", 10)
    }).then(user => {
        user.setRoles([1]);
    })

    User.create( {
        username: "admin",
        firstName: "Jan",
        lastName: "Kowalski",
        password: bcrypt.hashSync("admin", 10)
    }).then(user => {
        user.setRoles([1, 2]);
    })
}

module.exports = app;
