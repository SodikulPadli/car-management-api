const express = require("express");
const router = express.Router();

// middlewares
const { auth } = require("../middlewares/auth");
const { uploadMobil } = require("../middlewares/uploads");

const { login, register, checkAuth } = require("../controllers/auth");
const { addUser, getUser, getUsers, updateUser, deleteUser } = require("../controllers/user");
const {addMobil,getMobil,getMobils,updateMobil,deleteMobil } = require("../controllers/mobil");

// Routes

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

router.post("/user",auth, addUser);
router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

router.post("/addMobil", auth, uploadMobil("foto"), addMobil);
router.get("/mobils", auth, getMobils);
router.get("/mobil/:id", auth, getMobil);
router.patch("/mobil/:id", auth, uploadMobil("foto"), updateMobil);
router.delete("/mobil/:id", auth, deleteMobil);



module.exports = router;