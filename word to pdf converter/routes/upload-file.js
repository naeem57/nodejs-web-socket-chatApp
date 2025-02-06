const express = require("express");
const multer = require("multer");
const docxToPDF = require("docx-pdf");
const path = require("path");

const router = express.Router();

// Setup file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// POST route for file upload and conversion
router.post("/file", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    // Output file path
    const outputPath = path.join(
      __dirname,
      "files",
      `${req.file.originalname}.pdf`
    );

    // Convert DOCX to PDF
    docxToPDF(req.file.path, outputPath, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Error converting docx to PDF!" });
      }

      // Respond with the download link for the converted file
      res.download(outputPath, (downloadErr) => {
        if (downloadErr) {
          console.error(downloadErr);
          return res
            .status(500)
            .json({ message: "Error downloading the PDF file!" });
        }
        console.log("File downloaded successfully!");
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

module.exports = router;
