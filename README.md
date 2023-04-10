# car-management-api

Ini adalah kumpulan API untuk management car yang dibangun dengan teknologi Node.js, Express, PostgreSQL dan sequelize.
1. Menerapkan desain pattern MVC
2. Endopint (asynchronous function)
3. Authentication dan authorization
3. Open API https://editor.swagger.io/

### OPEN API
http://localhost:8000/api-docs/

 
 ## End Point API 
 - Register
 ```
 exports.register = async (req, res) => {
  // data input
  const data = req.body;

  // validate input
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    email: Joi.string().email().min(4).required(),
    password: Joi.string().min(5).required(),
  });

  const { error } = schema.validate(data);

  if (error) {
    return res.send({
      status: "Failed",
      message: error.details[0].message,
    });
  }

  // hashed password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  // core
  try {
    // check user exist
    const userExist = await User.findOne({
      where: {
        email: data.email,
      },
    });

    if (userExist) {
      return res.send({
        status: "Failed",
        message: "Email has been registered",
      });
    }

    // post to database
    const newUser = await User.create({
      ...data,
      password: hashedPassword,
      role: "customer",
    });

    const userData = {
      name: newUser.name,
      email: newUser.email,
    };

    res.status(200).send({
      status: "Success",
      message: "Account registration successful",
      data: {
        user: userData,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};
 ```
- Login 
 ```
 exports.login = async (req, res) => {
  // data input
  const data = req.body;
  try {
    // check user exist by email
    const userExist = await User.findOne({ where: { email: data.email } });

    if (userExist === null) {
      return res.send({
        status: "Failed",
        message: "Invalid email or password",
      });
    }

    // check user exist by password
    const isValid = await bcrypt.compare(data.password, userExist.password);

    if (!isValid) {
      return res.send({
        status: "Failed",
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: userExist.id }, process.env.TOKEN_KEY);

    res.status(200).send({
      status: "Success",
      message: "Login successful",
      data: {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
        role: userExist.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Server error",
    });
  }
};
 ```
- Seeder (demo user)
```
name: "sodikul padli",
email: "coolman@gmail.com",
password:"123456",
role: "superadmin",
createdAt: "2023-04-08 00:00",
updatedAt: "2023-04-08 00:00"
```

## Kontribusi
- Selalu terbuka untuk kontribusi dari para pengembang. Jika Anda ingin berkontribusi pada proyek ini, silakan buat pull request dan kami akan mereviewnya secepat mungkin.
