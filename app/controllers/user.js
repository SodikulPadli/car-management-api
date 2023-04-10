const { User } = require("../../models")
const bcrypt = require("bcrypt");
exports.addUser = async (req, res) => {
  const data = req.body
   // hashed password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  try {
   
      const newUser = await User.create({
      ...data,
      password: hashedPassword,
      role: "admin",
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
        res.send({
            status: "failed",
            message:"Server Error",
        })
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"]
            }
        });
        res.send({
            status: "success",
            data: {
                users,
            }
        });
    } catch (error) {
        res.send({
            status: "failed",
            message: "server error"
        });
    }
}

exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await User.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"]
            }
        });
        res.send({
            status: "success",
            data: {
                user: data,
            },
        });
    } catch (error) {
        res.send({
            status: "failed",
            message: "server error"
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.update(req.body, {
            where: {
                id,
            },
        });
        res.send({
            status: "success",
            message: `update user id :${id} finished`,
            data: req.body,
        });
    } catch (error) {
        res.send({
            status: "failed",
            message: "server error"
        });
    }
}

exports.deleteUser = async (req, res) => {
    try {
         const { id } = req.params;
    await User.destroy({
        where: {
            id,
        }
    });
    res.send({
        status: "success",
        message: `Delete User id :${id} finished`,
    });
    } catch (error) {
        res.send({
            status: "failed",
            message: "server error",
        });
    }
   
}