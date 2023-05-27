const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: false,

        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.recipe = require("./recipe.model.js")(sequelize, Sequelize);
db.ingredient = require("./ingredient.model.js")(sequelize, Sequelize);
db.image = require("./image.model.js")(sequelize, Sequelize);
db.comment = require("./comment.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});
db.recipe.hasMany(db.ingredient, {
    as: "ingredients",
    onDelete: "CASCADE"
})
db.ingredient.belongsTo(db.recipe, {
    foreignKey: "recipeId",
    as: "recipe",
    onDelete: "CASCADE"
});
db.recipe.belongsTo(db.user, { as: "author"});

db.recipe.belongsTo(db.image, {
    as: "image",
    onDelete: "CASCADE"
});

db.recipe.hasMany(db.comment, {
    as: "comments",
    onDelete: "CASCADE"
});
db.comment.belongsTo(db.recipe, {
    foreignKey: "recipeId",
    as: "recipe",
    onDelete: "CASCADE"
});
db.comment.belongsTo(db.user, { as: "author"});

db.ROLES = ["user", "admin"];

db.RECIPE_TYPES = ["śniadanie", "obiad", "deser", "kolacja"];
db.RECIPE_DIFFICULTY = ['łatwy', 'średni', 'trudny'];

db.INGREDIENT_UNIT = ['ml', 'l', 'g', 'dg', 'kg', 'szt', 'łyżka', 'szklanka']

module.exports = db;
