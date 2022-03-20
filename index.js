const express = require("express");
const http = require("http");
const path = require("path");

const port = process.env.PORT || 3001;

const app = express();

// set the path to the public assets
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

// Show submission page
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

// use the http module to create an http server listening on the specified port
http.createServer(app).listen(port, () => {
  console.log(`see the magic at: http://localhost:${port}`);
});
