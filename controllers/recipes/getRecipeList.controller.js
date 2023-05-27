const db = require("../../models")
const Recipe = db.recipe;
const User = db.user;
const Ingredient = db.ingredient;
const Comment = db.comment;

const ALLOWED_ORDER_DIRECTION = ['ASC', 'DESC']
const ALLOWED_ORDERS = ['prepareMinutes', 'createdAt']

exports.getList = (req, res) => {
    console.log(req);
    let filters = req.query;
    let error = validateFilters(filters, res);
    if (error) {
        return;
    }

    Recipe.findAll({
        attributes: {
          exclude: ['description', 'updatedAt', 'authorId']
        },
        include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'firstName', 'lastName']
        }],
        where: buildFilters(filters),
        order: buildOrder(filters)
    }).then(recipeList => {
        res.send(recipeList);
    })
}
function validateFilters(filters, res) {
    if (!filters) {
        return false;
    }
    if (filters.type && !db.RECIPE_TYPES.includes(filters.type)) {
        res.status(400).send({
            message: "Type does not exist = " + filters.type + ". Allowed values: " + db.RECIPE_TYPES
        });
        return true;
    }
    if (filters.difficulty && !db.RECIPE_DIFFICULTY.includes(filters.difficulty)) {
        res.status(400).send({
            message: "Difficulty does not exist = " + filters.difficulty + ". Allowed values: " + db.RECIPE_DIFFICULTY
        });
        return true;
    }
    if (filters.orderDirection && !ALLOWED_ORDER_DIRECTION.includes(filters.orderDirection)) {
        res.status(400).send({
            message: "Order direction does not exist = " + filters.orderDirection + ". Allowed values: " + ALLOWED_ORDER_DIRECTION
        });
        return true;
    }
    if (filters.orderBy && !ALLOWED_ORDERS.includes(filters.orderBy)) {
        res.status(400).send({
            message: "Order direction does not exist = " + filters.orderBy + ". Allowed values: " + ALLOWED_ORDERS
        });
        return true;
    }
}

function buildFilters(filters) {
    let result = {};
    if (!filters) {
        return result;
    }
    if (filters.type) {
        result.type = filters.type;
    }
    if (filters.difficulty) {
        result.difficulty = filters.difficulty;
    }
    return result;
}

function buildOrder(filters) {
    let orderBy;
    let direction;
    if (!filters.orderBy) {
        orderBy = 'createdAt';
    } else {
        orderBy = filters.orderBy;
    }
    if (!filters.orderDirection) {
        direction = 'DESC';
    } else {
        direction = filters.orderDirection;
    }
    return [
        [orderBy, direction],
        ['createdAt', 'DESC']
    ];
}