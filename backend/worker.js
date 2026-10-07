import { Worker } from 'bullmq';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";


const worker = new Worker(
  "file-processing",
  async (job) => {
    if (job.name !== "file") return;

    const { filePath, originalName } = job.data;
    console.log(`Processing ${originalName} from ${filePath}`);

    const loader = new PDFLoader(filePath, { splitPages: false });
    const docs = await loader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100,
    });
    const chunks = await splitter.splitDocuments(docs);

    console.log(`Processed ${originalName}: ${chunks.length} text chunks`);
    return { originalName, chunkCount: chunks.length };
  },
  {
    concurrency: 5,
    connection: {
      host: process.env.REDIS_HOST ?? "127.0.0.1",
      port: Number(process.env.REDIS_PORT ?? 6379),
    },
  },
);

worker.on("ready", () => console.log("File-processing worker connected to Redis"));
worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
worker.on("failed", (job, error) => {
  console.error(`Job ${job?.id ?? "unknown"} failed:`, error);
});
worker.on("error", (error) => console.error("Worker error:", error));