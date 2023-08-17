const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY, CORPORATE_EMAIL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
    // додаємо в функцію sendEmail data з контролера де в ньому
    // кому відправити(to) що відправити (subject) та зміст(html)
    const email = { ...data, from: CORPORATE_EMAIL };
    // відправляємо імейл
    await sgMail.send(email);
    // повертає тру ящо все добре
    return true;
    // якщо ні то викидає помилку і з нею розбирається контролер
};
module.exports = sendEmail;