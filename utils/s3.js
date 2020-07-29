const AWS = require('aws-sdk');
const crypto = require("crypto");
const { ACCESS_KEY_AWS, SECRET_KEY_AWS, AWS_REGION_UPLOAD, S3_BUCKET } = require('./config');

AWS.config.update({
  accessKeyId: ACCESS_KEY_AWS,
  secretAccessKey: SECRET_KEY_AWS,
  region: AWS_REGION_UPLOAD
});

const s3Api = new AWS.S3({ signatureVersion: 'v4' });

const generateSignedUrl = async (fileLocation, fileType) => {
  const signedUrl = s3Api.getSignedUrlPromise('putObject', {
    Bucket: S3_BUCKET,
    Key: fileLocation,
    Expires: 60 * 5,
    ContentType: fileType,
    ACL: 'public-read'
  });
  return signedUrl;
};

const digestMessage = message => crypto.createHash('sha1').update(message).digest('hex');

const generateUploadHash = (data) => {
  const stringifiedUserFields = JSON.stringify({ ...data, date: Date.now() });
  return digestMessage(stringifiedUserFields)
};

const MIME_MAP = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  webp: "image/webp",
  bmp: "image/bmp",
  png: "image/png",
  gltf: "model/gltf+json",
  glb: "model/gltf-binary",
  bin: "application/octet-stream",
  obj: "text/plain",
  zip: "application/zip",
  fbx: "application/octet-stream",
  dae: "application/collada+xml",
  stl: "application/vnd.ms-pkistl",
  pdf: "application/pdf"
}

function mapFormatToMIME(assetType) {
  return MIME_MAP[assetType];
}

module.exports = {
  generateSignedUrl: generateSignedUrl,
  generateUploadHash: generateUploadHash,
  mapFormatToMIME: mapFormatToMIME
}