const admin = (req, res, next) => {
	if (!req.user.isAdmin)
		return res.status(400).send('Access denied. Only Admin hass access');
	next();
};

module.exports = admin;
