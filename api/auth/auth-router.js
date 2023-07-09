const { userNameVarmı, usernameBostamı } = require("./auth-middleware");
const User = require("../users/user-model");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../secrets");

router.post("/register", usernameBostamı, async (req, res, next) => {
  //elimizde username
  try {
    const { username, password } = req.body;

    const newUser = { username: username, password: req.hashedPassword };
    const insertedUser = await User.insert(newUser);
    res.json(insertedUser);
  } catch (error) {
    next(error);
  }

  /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.
    2^8 HASH TURUNU AŞMAYIN!

    1- Yeni bir hesap kaydetmek için istemci "kullanıcı adı" ve "şifre" sağlamalıdır:
      {
        "username": "Captain Marvel", // `users` tablosunda var olmalıdır
        "password": "foobar"          // kaydedilmeden hashlenmelidir
      }

    2- BAŞARILI kayıtta,
      response body `id`, `username` ve `password` içermelidir:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- Request bodyde `username` ya da `password` yoksa BAŞARISIZ kayıtta,
      response body şunu içermelidir: "username ve şifre gereklidir".

    4- Kullanıcı adı alınmışsa BAŞARISIZ kayıtta,
      şu mesajı içermelidir: "username alınmış".
  */
});

router.post("/login", userNameVarmı, (req, res) => {
  const { password } = req.body;
  //compareSync fonksiypnu hashlenmiş password istemiyor, zaten databasede passwordler hashlenmiş şekilde duruyor. databasedeki hashlenmiş passwordu çekiyor.
  if (req.user && bcrypt.compareSync(password, req.user.password)) {
    const payload = {
      //tokenın içine data saklıyoruz, bu şekilde encode edicez, başka bieyerde decode edip kullanıcaz
      id: req.user.id,
      username: req.user.username,
      password: req.user.password,
    };
    const options = {
      expiresIn: "24h",
    };
    const token = jwt.sign(payload, JWT_SECRET, options);
    res.json({ message: `${req.user.username} geri geldi`, token: token });
  } else {
    res.status(401).json({ message: "geçersiz kriter" });
  }
  /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.

    1- Var olan bir kullanıcı giriş yapabilmek için bir `username` ve `password` sağlamalıdır:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- BAŞARILI girişte,
      response body `message` ve `token` içermelidir:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- req body de `username` ya da `password` yoksa BAŞARISIZ giriş,
      şu mesajı içermelidir: "username ve password gereklidir".

    4- "username" db de yoksa ya da "password" yanlışsa BAŞARISIZ giriş,
      şu mesajı içermelidir: "geçersiz kriterler".
  */
});

module.exports = router;
