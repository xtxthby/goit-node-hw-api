// для роботи з async-await
const fs = require('fs/promises')
// абсолютний шлях
const path = require("path");
// для автоматичного створення id
const {nanoid} = require("nanoid");

const contactsPath = path.join(__dirname, "models/contacts.json");
// функція яка повертає усі контакти
const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}
//  функція для отримання контакта по айді
const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find(item => item.id === contactId);
  return result || null;
}
// функція видалення
const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === contactId);
  if(index === -1){
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}
// функція додавання контакта
const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...body,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}
// функція редагування де перше це айді а друге дані
const updateContact = async (contactId, body) => {
  const contacts = await getAll();
  const index = contacts.findIndex(item => item.id === contactId);
  if(index === -1){
    return null;
  }
  contacts[index] = {contactId, ...body};
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
