const express = require("express");
const uploadFile = require("./routes/upload-file.js");

const app = express();
const port = 4000;

app.use("/convert", uploadFile);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
