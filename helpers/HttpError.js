// створюємо обєкт і під кожен статус записан
// стандартний меседж 
const errorMessageList = {
  400: "Bad Request",
  401: "Not authorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};
// Функція отримує в якості параметра статус і меседж,
// якщо меседж не передали візьми стандартний меседж зі списку
// враховуючи статус
const HttpError = (status, message= errorMessageList[status]) => {
    // створюємо помилку з меседжем
    const error = new Error(message);
     // присвоюємо переданий статус
    error.status = status;
    return error;
};

module.exports = HttpError;
