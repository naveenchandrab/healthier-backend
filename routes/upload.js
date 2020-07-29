const express = require('express');
const service = require('../utils/s3');

const router = express.Router();

router.post('/', async (req, res) => {
	const file = req.body;
	const { name, size, type, id } = file;
	const mimeType = name.split('.').pop();
	const mime = service.mapFormatToMIME(mimeType);
	const fileName = service.generateUploadHash(file);
	const fileLocation = `${id}/${fileName}.${mimeType}`;
	try {
		res.json({
			signedUrl: await service.generateSignedUrl(fileLocation, mime),
		});
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

module.exports = router;
