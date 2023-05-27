module.exports = {
    HOST: "localhost",
    USER: "przepisy",
    PASSWORD: "przepisy",
    DB: "przepisy",
    dialect: "postgres",
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};