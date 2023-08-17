// міделвара ідентифікації
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//  для тимчасової аватарки ми викликаємо
//  встановленний пакет gravatar
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
// пакет для обробки аватарки
const Jimp = require("jimp");
const {nanoid} = require("nanoid");


const {User} = require("../models");
// імпортуємо sendEmail
const {HttpError, ctrlWrapper, sendEmail} = require("../helpers");
// зі змінних оточення забираємо ключ
const { SECRET_KEY, BASE_URL  } = process.env;
// тут шлях до папки з аватарками з підняттям на одну папку в гору
const avatarDir = path.join(__dirname, "../", "public", "avatars");
// створюємо перший контролер регістрації
const register = async (req, res) => {
    const { email, password } = req.body;
    // робимо запит чи є така людина в базі
    // findOne -- знаходить перше співпадіння і повертає
    const user = await User.findOne({ email });
    //  якщо є то викидаємо помилку
    if (user) throw HttpError(409, "Email in use");
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    //  хешуємо пароль перед зберіганням
    const hashPass = await bcrypt.hash(password, 10);
     //  створюємо нового сористувача пароль зберігаємо в захешованому вигляді
    const newUser = await User.create({ ...req.body, password: hashPass, avatarURL, verificationToken, });
    // створюємо імейл на підтверження
    const verifyEmail = {
    to: email,
    subject: "Verify email",
    // тут ми повинні прислати посилання тобіш тег а де в хреф буде записана адреса (унікальна силка)
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verufy emil</a>`,
    };
    await sendEmail(verifyEmail);
    // те що отримуємо
    res.status(201).json({
        user: {
        email: newUser.email,
        subscription: newUser.subscription,
        },
    });
};

const verifyEmail = async (req, res) => {
    // беремо з параметрів веріфікейшинтокен
    const { verificationToken } = req.params;
    // перевіряємо чи є в базі людина з таким кодом
    const user = await User.findOne({ verificationToken });
    // якщо його немає то викидаємо помилку
    if (!user) throw HttpError(404, "User not found");
    // якщо є то оновлюємо базу даних де ми поле verify робимо тру
    // а веріфікейшинтокен робимо пустим щоб два рази не підтвержувати
    await User.findByIdAndUpdate(user._id, {
        verify: true,
        verificationToken: "",
    });
    // відправляємо повідомлення
    res.json({
        message: "Verification successful",
    });
};
const resendVerifyEmail = async (req, res) => {
    // беремо з тіла запиту імейл на який треба відіслати
    const { email } = req.body;
    // перевіряємо чи є в базі такий користувач з таким імейлом
  const user = await User.findOne({ email });
  // якщо такої людини немає
  if (!user) throw HttpError(401, "Email not found");
  // якщо людина вже вірефікована то інша помилка 
  if (user.verify) throw HttpError(400, "Verification has already been passed");
  // якщо людина є але не веріфікована то треба знов відправить форму
  const verifyEmail = {
    to: email,
      subject: "Verify email",
    // але verificationToken ми беремо з дази так як там він вже є зареєстрований
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
  };
  // відправляємо його
  await sendEmail(verifyEmail);
  // також відправляємо повідомлення
  res.json({
    message: "Verification email sent",
  });
};



const login = async (req, res) => {
    const { email, password } = req.body;
    // так само рревіряємо на співпадіння
    const user = await User.findOne({ email });
    // якщо його немає викидаємо помилку неавторизовано
    if (!user) throw HttpError(401, "Email or password is wrong");
    //  якщо юзер verify фолс тобіш не підтвердила імеіл
    // то викидаємо помилку
    if (!user.verify) throw HttpError(401, "Email not verify");
    // якщо користувач є то порівнюємо пароль де перший аргумент
    // пароль з фронтенду а другий який зберігається в базі
    const passCompare = await bcrypt.compare(password, user.password);
    // .якщо не співпадають то викидаємо помилку
    if (!passCompare) throw HttpError(401, "Email or password is wrong");
    // створюємо payload де зазвичай айді користувача
    const payload = {
        id: user._id,
    };
    // sign-це метод підпис
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
    // під час логіну ми не тільки відсилаємо токен 
    // на фронтенд ми записуємо його в базі
    await User.findOneAndUpdate(user._id, { token });
    // Якщо все співпало то створюємо токін
    res.json({
        token,
        user: {
        email: user.email,
        subscription: user.subscription,
        },
    });
};
// якщо токен валідний то відсилаємо  імейл і підписку
const getCurrent = async (req, res) => {
    // достаємо всю інформацію яка потрібна із req.user
    const { email, subscription } = req.user;
    //  і відсилаємо
    res.json({ email, subscription });
};

const logout = async (req, res) => {
    // беремо айді користувача
    const { _id } = req.user;
    // викликаємо метод який робить токен пустий
    await User.findByIdAndUpdate(_id, { token: "" });
    // . відсилаємо на фронтенд якесь повідомлення
    res.status(204).json();
};

const updateSubscription = async (req, res) => {
    const { _id } = req.user;

    if (!req.body) throw HttpError(400, "missing field subscription");

    const { email, subscription } = await User.findByIdAndUpdate(_id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!email || !subscription) throw HttpError(404, "Not found");

    res.status(201).json({ email, subscription });
};

const updAvatar = async (req, res) => {
    // витягуємо айді користувача який робить запит
    const { _id } = req.user;

    if (!req.file) throw HttpError(400, "missing field avatar");
    // з файлу витякуємо шлях до зображення і назву
    const { path: tempUpload, originalname } = req.file;
    // Jimp.read читає шлях передаємо в then- (img) і за допомогою метода
    // resize задаємо розмір , після цього зберігаємо в файлі
    await Jimp.read(tempUpload).then((img) =>
        img.resize(250, 250).write(`${tempUpload}`)
    );
    // для того щоб аватарка була унікальною ми додаємо айді
    // а імя залишаємо старе і таким чином можна зберігати в 
    // одному файлі усі аватарки
    const fileName = `${_id}_${originalname}`;
    // створюємо шлях де він має зберігатися де avatarDir шлях до 
    // папки з аватарками
    const resultUpload = path.join(avatarDir, fileName);
    // за допомогою  fs.rename переміщюємо з 
    // тимчасового tempUpload в resultUpload
    await fs.rename(tempUpload, resultUpload);
    // тепер цей шлях записуємо в базу
    const avatarURL = path.join("avatars", fileName);
    // тепет знаючи айді ми перезаписуємо аватар 
    await User.findByIdAndUpdate(_id, { avatarURL });

    if (!avatarURL) throw HttpError(404, "Not found");
    //  повертаємо
    res.json({ avatarURL });
};








module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    logout: ctrlWrapper(logout),
    getCurrent: ctrlWrapper(getCurrent),
    updateSubscription: ctrlWrapper(updateSubscription),
    updAvatar: ctrlWrapper(updAvatar),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};