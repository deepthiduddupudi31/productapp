const {
  BlobServiceClient,
  StorageSharedKeyCredential
} = require("@azure/storage-blob");

require("dotenv").config();

const connectionString =
  process.env.AZURE_STORAGE_CONNECTION_STRING;

const containerName =
  process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!connectionString) {
  throw new Error("AZURE_STORAGE_CONNECTION_STRING is missing");
}

if (!containerName) {
  throw new Error("AZURE_STORAGE_CONTAINER_NAME is missing");
}

const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);

const containerClient =
  blobServiceClient.getContainerClient(containerName);

async function uploadToBlob(file) {
  const extension = file.originalname.includes(".")
    ? "." + file.originalname.split(".").pop()
    : "";

  const fileName =
    `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}${extension}`;

  const blockBlobClient =
    containerClient.getBlockBlobClient(fileName);

  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: {
      blobContentType: file.mimetype
    }
  });

  return blockBlobClient.url;
}

module.exports = {
  containerClient,
  uploadToBlob
};