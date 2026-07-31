import { findAllMaterials } from '#repositories/materials.js';
import { sendSuccess } from '#utils/response.js';

export const getMaterials = async (_req, res) => {
	res.set('Cache-Control', 'max-age=300');

	const materials = await findAllMaterials();
	return sendSuccess(res, materials);
};
