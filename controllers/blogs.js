const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.post("/", async (req, res) => {
	const body = req.body;
	const user = req.user;
	const blog = new Blog({
		title: body.title,
		author: user.username,
		url: `api/blogs/${body.title.replaceAll(" ", "")}`,
		likes: body.likes,
		user: user._id,
	});
	const savedBlog = await blog.save();
	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();
	res.json(savedBlog);
});

blogsRouter.get("/", async (req, res) => {
	const blogs = await Blog.find({}).populate("user", {username: 1, name: 1});
	res.json(blogs);
});

blogsRouter.get("/:id", async (req, res) => {
	const blog = await Blog.findById(req.params.id);
	if (blog) {
		res.json(blog);
	} else {
		res.status(404).end();
	}
});

blogsRouter.put("/:id", async (req, res) => {
	const body = req.body;
	const user = req.user;
	const blog = await Blog.findById(req.params.id);

	const blogObject = {
		title: blog.title,
		author: blog.author,
		url: blog.url,
		likes: body.likes,
		user: blog.user,
	};
	const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blogObject, {
		new: true,
		runValidators: true,
		context: "query",
	});
	user.blogs = user.blogs.concat(updatedBlog._id);
	await user.save();
	res.json(updatedBlog);
});

blogsRouter.delete("/:id", async (req, res) => {
	await Blog.findByIdAndRemove(req.params.id);
	res.status(204).end();
});

module.exports = blogsRouter;
