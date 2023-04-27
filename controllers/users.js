// const config = require("../utils/config");
// const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
	const users = await User.find({});
	// const users = await User.find({}).populate("blogs", {title: 1, url: 1});
	res.json(users);
});

usersRouter.get("/:id", async (req, res) => {
	const user = await User.findById(req.params.id);
	if (user) {
		res.json(user);
	} else {
		res.status(404).end();
	}
});

usersRouter.post("/", async (req, res) => {
	const user = req.body;

	const saltRounds = 10;
	if (user.password.length < 3) {
		return res.status(401).json({error: "password invalid"});
	} else if (user.password.length >= 3) {
		const passwordHash = await bcrypt.hash(user.password, saltRounds);
		user.password = passwordHash;

		const newUser = new User(user);
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	}
});

// usersRouter.put("/:id", async (req, res) => {});

usersRouter.delete("/:id", async (req, res) => {
	await User.findByIdAndRemove(req.params.id);
	res.status(204).end();
});

module.exports = usersRouter;
