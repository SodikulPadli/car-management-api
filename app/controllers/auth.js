const { User } = require("../../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// register
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
      role: "member",
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

// login
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

// checkAuth
exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }

    res.send({
      status: "success...",
      data: {
        user: {
          id: dataUser.id,
          name: dataUser.name,
          email: dataUser.email,
          role: dataUser.role,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};