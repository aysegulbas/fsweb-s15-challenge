const { HASH_ROUND } = require("../../secrets");
const User = require("../users/user-model");
const bcrypt = require("bcryptjs");

const userNameVarmı = async (req, res, next) => {
  const { username } = req.body;
  const user = await User.getByFilter({ username: username });
  if (!user) {
    res.status(401).json({ message: "user tanımlı değil" }); //login için yazıyoruz şuan, username olmalı databasede
  } else {
    req.user = user;
    next();
  }
};
const usernameBostamı = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.getByFilter({ username: username });
  if (user) {
    res.status(422).json({ message: "User zaten var" });
  } else {
    //passwordu burda hashledik
    const hashedPassword = bcrypt.hashSync(password, HASH_ROUND);
    req.hashedPassword = hashedPassword;
    //reuestin içinde hashlenmiş passwordu saklamış olduk.routerda registera da yazabilirdik.
    next();
  }
};
module.exports = { userNameVarmı, usernameBostamı };
