// міделвара ідентифікації
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {User} = require("../models/user");

const {HttpError, ctrlWrapper} = require("../helpers");
// зі змінних оточення забираємо ключ
const { SECRET_KEY } = process.env;
// створюємо перший контролер регістрації
const register = async (req, res) => {
    const { email, password } = req.body;
    // робимо запит чи є така людина в базі
    // findOne -- знаходить перше співпадіння і повертає
    const user = await User.findOne({ email });
    //  якщо є то викидаємо помилку
    if (user) throw HttpError(409, "Email in use");
    //  хешуємо пароль перед зберіганням
    const hashPass = await bcrypt.hash(password, 10);
     //  створюємо нового сористувача
    const newUser = await User.create({ ...req.body, password: hashPass });
    // те що отримуємо
    res.status(201).json({
        user: {
        email: newUser.email,
        subscription: newUser.subscription,
        },
    });
};


const login = async (req, res) => {
    const { email, password } = req.body;
    // так само рревіряємо на співпадіння
    const user = await User.findOne({ email });
    // якщо його немає викидаємо помилку неавторизовано
    if (!user) throw HttpError(401, "Email or password is wrong");
    // якщо користувач є то порівнюємо пароль де перший аргумент
    // пароль з фронтенду а другий який зберігається в базі
    const passCompare = await bcrypt.compare(password, user.password);
    // .якщо не співпадають то викидаємо помилку
    if (!passCompare) throw HttpError(401, "Email or password is wrong");
    // створюємо payload
    const payload = {
        id: user._id,
    };
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
// якщо токен валідний по відсилаємо  імейл і підписку
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




module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscription: ctrlWrapper(updateSubscription),
};