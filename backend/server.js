const express = require('express');
const cors = require('cors');
const { Client } = require('minio');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
const path = require('path');
app.use(express.static(path.join(__dirname, '..')));

// Configuração do MinIO
const minioClient = new Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
});

const BUCKET_NAME = 'readify-pdfs';

// Endpoint para gerar URL de upload (presigned URL)
app.get('/get-upload-url', (req, res) => {
  const { filename } = req.query;
  minioClient.presignedPutObject(BUCKET_NAME, filename, 60 * 60, (err, url) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ url });
    }
  });
});

// Endpoint para gerar URL de download
app.get('/get-download-url', (req, res) => {
  const { filename } = req.query;
  minioClient.presignedGetObject(BUCKET_NAME, filename, 60 * 60, (err, url) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ url });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});