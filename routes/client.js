const express = require('express');
const router = express.Router();

const client = require('../controllers/client')
const catchAsync = require('../utils/catchAsync');

const upload = client.upload;
const fileUpl = client.fileUpload

router.post('/upload', upload.single('file'), catchAsync(fileUpl))

router.get('/select/:fileId', catchAsync(client.viewFileContents))

router.get('/select/:fileId/new', catchAsync(client.renderNewEntryForm))

router.post('/select/:fileId', catchAsync(client.saveNewEntry))

router.put('/select/:fileId/:id', catchAsync(client.updateEntry))

router.delete('/select/:fileId/:id', catchAsync(client.deleteEntry))

module.exports = router