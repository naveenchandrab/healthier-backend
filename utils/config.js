const { ACCESS_KEY_AWS, SECRET_KEY_AWS, AWS_REGION_UPLOAD, S3_BUCKET } = process.env;

const exportableEnv = {
  ACCESS_KEY_AWS,
  SECRET_KEY_AWS,
  AWS_REGION_UPLOAD,
  S3_BUCKET
};

module.exports = exportableEnv;