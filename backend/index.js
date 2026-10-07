import express from "express";
import multer from "multer";
import { Queue } from "bullmq";
import cors from "cors";
const app = express();
const queue = new Queue("file-processing", {
  connection: {
    host: process.env.REDIS_HOST ?? "127.0.0.1",
    port: Number(process.env.REDIS_PORT ?? 6379),
  },
});

const upload = multer({ dest: "uploads/" });
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(cors({ origin: '*' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/pdf", upload.single("file"), async (req, res) => {
  // Handle PDF generation logic here
  console.log("api called",req.file)
  const file = req.file;
  if (!file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    await queue.add("file", {
      filePath: file.path,
      originalName: file.originalname,
    });
    console.log("File uploaded and queued:", file);
    res.status(200).json({ message: "File uploaded successfully", file });
  } catch (error) {
    console.error("Failed to queue uploaded file:", error);
    res.status(503).json({ message: "File could not be queued. Check Redis." });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
