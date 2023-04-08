// import models
const { Mobil} = require('../../models');
const Joi = require('joi');
// cloudinary
const cloudinary = require('../utils/Cloundinary');

// add movil
exports.addMobil = async (req, res) => {
  // data input
  const data = req.body;
  // cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: 'Mobil',
    use_filename: true,
    unique_filename: false,
  });

  // id from user
  const { id } = req.user;

  // joi validate input
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    tipe: Joi.string().required(),
    manufactur: Joi.string().required(),
    harga_sewa:Joi.number().required()
  });

  const { error } = schema.validate(data);

  if (error) {
    return res.send({
      status: 'Failed',
      message: error.details[0].message,
    });
  }

  try {
    // create mobil
    const newMobil = await Mobil.create({
      ...data,
      foto: result.public_id,
    });

    let mobilData = await Mobil.findOne({
      where: {
        id: newMobil.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    mobilData = JSON.parse(JSON.stringify(mobilData));

    mobilData = {
      ...mobilData,
      foto: process.env.PATH_FILE + mobilData.foto,
    };
    res.status(200).send({
      status: 'Success',
      message: 'mobil created successfully',
      data: mobilData,
    });
  } catch (error) {
    res.status(400).send({
      status: 'Error',
      message: 'Server error',
    });
  }
};

// get all mobil
exports.getMobils = async (req, res) => {
  try {
    let mobilData = await Mobil.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    mobilData = JSON.parse(JSON.stringify(mobilData));

    mobilData = mobilData.map((item) => {
      return {
        ...item,
        foto: process.env.PATH_FILE + item.foto,
      };
    });
    res.send({
      status: 'Success',
      message: 'mobil data found',
      data: mobilData,
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Server error',
    });
  }
};

// get mobil
exports.getMobil = async (req, res) => {
  // get id params
  const { id } = req.params;
  try {
    // find product
    let mobilData = await Mobil.findOne({
        where: {
            id
        },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    // mobil not found
    if (mobilData === null) {
      return res.send({
        status: 'Success',
        message: 'mobil data not found',
      });
    }

    mobilData = JSON.parse(JSON.stringify(mobilData));

    mobilData = {
      ...mobilData,
      foto: process.env.PATH_FILE + mobilData.foto,
    };

    res.send({
      status: 'Success',
      message: 'mobil data found',
      data: mobilData,
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Server error',
    });
  }
};

// update mobil
exports.updateMobil = async (req, res) => {
  // get id params
  const { id } = req.params;
  // data
//   const data1 = req.body;
  const data = {
    name: req.body.name,
    description: req.body.description,
    tipe: req.body.tipe,
    manufactur: req.body.manufactur,
    harga_sewa: req.body.harga_sewa,
  };

  try {
    // update product
    if (req.file) {
      // get data before update
      const beforeUpdate = await Mobil.findOne({
        where: {
          id,
        },
      });
      // delete file to cloudinary
      cloudinary.uploader.destroy(beforeUpdate.foto);
      // upload file to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'Mobil',
        use_filename: true,
        unique_filename: false,
      });

      // update product
      await Mobil.update({ ...data, foto: result.public_id },
        {
          where: {
            id,
          },
        }
      );
    } else {
      await Mobil.update(data, {
        where: {
          id,
        },
      });
    }

    let mobilData = await Mobil.findOne({
        where: {
            id
        },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    // mobil not found
    if (mobilData === null) {
      return res.send({
        status: 'Success',
        message: 'mobil data not found',
      });
    }

    mobilData = JSON.parse(JSON.stringify(mobilData));

    mobilData = {
      ...mobilData,
      foto: process.env.PATH_FILE + mobilData.foto,
    };

    res.send({
      status: 'Success',
      message: 'mobil data found',
      data: mobilData,
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Server error',
    });
  }
};

// delete mobil
exports.deleteMobil = async (req, res) => {
  // get id params
  const { id } = req.params;

  try {
    // get data before update
    const beforeUpdate = await Mobil.findOne({
      where: {
        id,
      },
    });

    // delete file to cloudinary
    cloudinary.uploader.destroy(beforeUpdate.foto);

    await Mobil.destroy({
      where: {
        id,
      },
    });

    res.status(200).send({
      status: 'Success',
      message: 'mobil data deleted successfully',
    });
  } catch (error) {
    res.status(500).send({
      status: 'Error',
      message: 'Server error',
    });
  }
};