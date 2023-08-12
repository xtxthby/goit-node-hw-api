// імпортуемо multer та створюємо за допомогою її міделвару
const multer = require("multer");
// адресу краще писати через пас тому імпортуємо
const path = require("path");

// створюємо шлях до тимчасової папки Тут додаємо шлях щоб піднятися на
// одну папку доверху
const tempDir = path.join(__dirname, "../", "tmp");
// тут обєкт налаштування де ми перед створенням міделвари 
// викликаємо метод diskStorage і передамо обєкт де передамо налаштування
const multerConfig = multer.diskStorage({
    // destination це шлях до тимчасової папки де тимчасово зберігається файл
    // це=== temp
  destination: tempDir,
    filename: (req, file, cb) => {
    // якщо немає помилок передати null , другий аргумент імя файла
    // в даному випадку це те імя яке нам прийшло(file.originalname)
    cb(null, file.originalname);
  },
});
// створюємо міделвару для зберігання де викликаємо multer як функйію
// передаємо для налаштування обєкт в властивость storage присвоїмо  multerConfig
const upload = multer({ storage: multerConfig });

module.exports = upload;