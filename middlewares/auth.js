const jwt = require('jsonwebtoken');
const config = require('config');

const auth = (req, res, next) => {
	const token = req.header('x-auth-token');
	if (!token) return res.status(400).send('Access denied. Not token found');
	try {
		const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
		req.user = decoded;
		next();
	} catch (ex) {
		res.status(400).send(ex.message);
	}
};

module.exports = auth;
