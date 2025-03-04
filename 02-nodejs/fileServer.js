/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module

  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files

  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt

    - For any other route not defined in the server return 404

    Testing the server - run `npm run test-fileServer` command in terminal
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const dirPath = './files/'

function listFiles() {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        reject(err);
      }

      resolve(files);
    })
  })
}

function readFileContent(filePath) {
  return new Promise((resolve, reject) => {
  })
}

// task 1
app.get('/files', (req, res) => {
  const result = listFiles();

  result
    .then((files) => {
      res.status(200).json(files);
    })
    .catch((err) => {
      res.status(500).send(err + 'Failed to retrieve files');
    })

})

// task 2
app.get('/file/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = `./files/${fileName}`;

  const readableStream = fs.createReadStream(filePath, 'utf-8');

  readableStream.on('error', (err) => {
    if (err.code === 'ENOENT') {
      res.status(404).send('File not found');
    } else {
      res.status(500).send('Internal server error');
    }
  })

  res.status(200);
  readableStream.pipe(res);

})

app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

// app.listen(5000, () => {
//   console.log('server on');
// })

module.exports = app;
