import { findAllBlogPosts, findBlogPostBySlug } from '#repositories/blogPosts.js';
import { HttpError } from '#utils/error.js';
import { sendSuccess } from '#utils/response.js';

export const getBlogPosts = async (_req, res) => {
	res.set('Cache-Control', 'max-age=300');

	const posts = await findAllBlogPosts();
	return sendSuccess(res, posts);
};

export const getBlogPostBySlug = async (req, res) => {
	res.set('Cache-Control', 'max-age=300');

	const post = await findBlogPostBySlug(req.params.slug);

	if (!post) {
		throw new HttpError(404, 'Blog post not found.');
	}

	return sendSuccess(res, post);
};
