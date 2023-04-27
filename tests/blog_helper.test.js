const blogHelper = require("./blog_helper");

test("dummy returns one", () => {
	const blogs = [];

	const result = blogHelper.dummy(blogs);
	expect(result).toBe(1);
});

describe("total likes", () => {
	test("when list has only one blog, equals the likes of that", () => {
		const result = blogHelper.totalLikes(blogHelper.listWithOneBlog);
		expect(result).toBe(7);
	});

	test("when list has two blogs, equals the total likes between them", () => {
		const result = blogHelper.totalLikes(blogHelper.listWithTwoBlogs);
		expect(result).toBe(15);
	});
});

describe("favorite blog", () => {
	test("blog with most amount of likes", () => {
		const result = blogHelper.favoriteBlog(blogHelper.blogs);
		expect(result).toEqual({
			_id: "5a422b3a1b54a676234d17f9",
			title: "Canonical string reduction",
			author: "Edsger W. Dijkstra",
			url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
			likes: 12,
			__v: 0,
		});
	});
});

describe("most blogs", () => {
	test("author with the most blogs, and number of blogs", () => {
		const result = blogHelper.mostBlogs(blogHelper.blogs);
		expect(result).toEqual({
			author: "Robert C. Martin",
			blogs: 3,
		});
	});
});

describe("most likes", () => {
	test("author whose blog posts have most likes, along with amount of likes", () => {
		const result = blogHelper.mostLikes(blogHelper.blogs);
		expect(result).toEqual({
			author: "Edsger W. Dijkstra",
			likes: 12,
		});
	});
});
