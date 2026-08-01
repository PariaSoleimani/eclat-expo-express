import { findAllBanners } from '#repositories/banners.js';
import { sendSuccess } from '#utils/response.js';

export const getBanners = async (_req, res) => {
	res.set('Cache-Control', 'max-age=300');

	const banners = await findAllBanners();
	return sendSuccess(res, banners);
};
