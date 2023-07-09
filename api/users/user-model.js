const db = require("../../data/dbConfig");
const get = () => {
  return db("users");
};
const getById = (id) => {
  return db("users").select("id","username").where({ id: id }).first();
};
const getByFilter = (filter) => {
  return db("users").where(filter).first();
};
const insert = async (user) => {
  let [user_id] = await db("users").insert(user);
  return getById(user_id);
};
module.exports = {
  get,
  getById,
  getByFilter,
  insert,
};
