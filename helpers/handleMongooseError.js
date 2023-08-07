const handleMongooseError = (error, _, next) => {
  // в обєкті ерор є два поля
  const { name, code } = error;
  // якщо нейм дорівнює MongoServerErro і код дорівнює 11000 то помилка 409 інакше 400
  const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  error.status = status;
};

module.exports = handleMongooseError;