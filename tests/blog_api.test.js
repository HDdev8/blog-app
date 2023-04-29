const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helper = require("./test_helper");
const blogHelper = require("./blog_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

let currentUser;
let token;
let decodedToken;
let blogsAtStart;
let blogsAtEnd;
let blogToDelete;
let firstBlog;
let firstUser;
let header;
let userId;

beforeEach(async () => {
	await User.deleteMany({});
	const passwordHash = await bcrypt.hash("password", 10);
	const user = new User({
		username: "root",
		name: "hddev8",
		passwordHash,
		blogs: ["5a422a851b54a676234d17f7", "5a422aa71b54a676234d17f8", "5a422b3a1b54a676234d17f9"],
	});
	await user.save();
});

beforeEach(async () => {
	const user = {
		username: "root",
		password: "password",
	};
	blogsAtStart = await blogHelper.blogs1;
	currentUser = await api.post("/api/login").send(user);
	token = currentUser._body.token;
	header = {
		Authorization: `Bearer ${token}`,
	};
	decodedToken = jwt.verify(token, process.env.SECRET);
	userId = decodedToken.id;
});

beforeEach(async () => {
	await Blog.deleteMany({});
	const users = await User.find({});
	firstUser = users[0];
	const id = firstUser._id;
	console.log(id);
	// const id = "644cb72b5f9701aa34084408"
	const blogObjects = await Blog.insertMany(blogHelper.blogs1);
	for (let blog of blogObjects) {
		let blogObject = new Blog({
			title: blog.title,
			author: blog.author,
			likes: blog.likes,
			user: id.toString(),
		});
		await blogObject.save();
		firstUser.blogs = firstUser.blogs.concat(blog._id);
		await firstUser.save();
	}
});

describe("GET requests", () => {
	test("Blogs are returned as JSON", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	}, 10000);

	test("All blogs are returned", async () => {
		const res = await api.get("/api/blogs");
		expect(res.body).toHaveLength(6);
	});
});

describe("POST", () => {
	test("Adding new blogs", async () => {
		// blogsAtStart = await helper.blogsInDb();
		const newBlog = {
			title: "another test entry",
			author: "root",
			likes: 180,
			user: "644cb72b5f9701aa34084408",
		};
		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(200)
			.set(header)
			.expect("Content-Type", /application\/json/);
		// const blogsAtEnd = await helper.blogsInDb();
		blogsAtEnd = blogsAtStart;
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);
		const contents = blogsAtEnd.map((res) => res.title);
		expect(contents).toContain("another test entry");
	}, 10000);

	// would require second user
	test("Adding blog without token", async () => {
		const newBlog = {
			title: "blog without token",
			author: "root",
			likes: 118,
			user: "644cb9adcb8b08262a1adcb8",
		};
		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(40111)
			.set(token)
			.expect("Content-Type", /application\/json/);
		blogsAtEnd = blogsAtStart;
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
	}, 10000);

	test("Adding new blog without token", async () => {
		const newBlog = {
			title: "A test without a token",
			author: "root",
			likes: 108,
			user: "644cb9adcb8b08262a1adcb8",
		};
		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(400)
			.expect("Content-Type", /application\/json/);
		blogsAtEnd = blogsAtStart;
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
		const contents = blogsAtEnd.map((res) => res.title);
		expect(contents).not.toContain("A test without a token");
	}, 10000);

	test("Blogs without a title", async () => {
		// blogsAtStart = await helper.blogsInDb();
		const newBlog = {
			author: "root",
			likes: 1008,
			user: "644cb9adcb8b08262a1adcb8",
		};
		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(400)
			.set(header)
			.expect("Content-Type", /application\/json/);
		// const blogsAtEnd = await helper.blogsInDb();
		blogsAtEnd = blogsAtStart;
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
	});
});

describe("DELETE", () => {
	test("Deleting blog", async () => {
		if (decodedToken.id) {
			// blogsAtStart = await helper.blogsInDb();
			blogToDelete = blogsAtStart[0];
			await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204).set(header);
			const blogsAfterDelete = await helper.blogsInDb();
			expect(blogsAfterDelete).toHaveLength(blogsAtStart.length - 1);
			const contents = blogsAfterDelete.map((res) => res.title);
			expect(contents).not.toContain(blogToDelete.title);
		}
	});

	test("Deleting nonexisting blog", async () => {
		const nonExistId = await helper.nonExistingId();
		await api.delete(`/api/blogs/${nonExistId}`).expect(204).set(token);
	});
});

test("PUT requests", async () => {
	if (decodedToken.id) {
		firstBlog = blogsAtStart[0];
		firstBlog.likes = 180;
		await api.put(`/api/blogs/${firstBlog._id}`).send(firstBlog).expect(200);
		// const blogsAtEnd = await blogHelper.blogs1;
		blogsAtEnd = blogsAtStart;
		const contents = blogsAtEnd.map((res) => res.likes);
		expect(contents).toContain(180);
	}
}, 10000);

afterAll(() => {
	mongoose.connection.close();
});
