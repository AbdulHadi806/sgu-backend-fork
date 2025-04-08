import express, {
  Application,
  Request,
  Response as ExpressResponse,
} from "express";
import { connectDB } from "./config/database";
import dotenv from "dotenv";
import routes from "./routes";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "./swaggerConfig";
import path from "path";
import cors from "cors";
import http from "http";
import { initSocketServer } from "./socket";

dotenv.config();
const app: Application = express();
const PORT = 3000;

app.use(express.json());
const swaggerDocs = swaggerJsDoc(swaggerConfig);
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
      persistAuthorization: true, // Keeps auth token when refreshing
    },
  })
);
app.use("/api", routes);

app.get("/stripe-redirect", (req: Request, res: ExpressResponse) => {
  const redirectUrl = "myapp://stripe-redirect";
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="refresh" content="0; url=${redirectUrl}">
        <title>Redirecting...</title>
      </head>
      <body>
        <p>If you are not redirected automatically, <a href="${redirectUrl}">click here</a>.</p>
      </body>
    </html>
  `);
});

app.get("/stripe-refresh", (req: Request, res: ExpressResponse) => {
  const redirectUrl = "myapp://stripe-refresh";
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="refresh" content="0; url=${redirectUrl}">
        <title>Redirecting...</title>
      </head>
      <body>
        <p>If you are not redirected automatically, <a href="${redirectUrl}">click here</a>.</p>
      </body>
    </html>
  `);
});
app.get("/success", (req: Request, res: ExpressResponse) => {
  const redirectUrl = "myapp://success";
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="refresh" content="0; url=${redirectUrl}">
        <title>Redirecting...</title>
      </head>
      <body>
        <p>If you are not redirected automatically, <a href="${redirectUrl}">click here</a>.</p>
      </body>
    </html>
  `);
});
app.get("/cancel", (req: Request, res: ExpressResponse) => {
  const redirectUrl = "myapp://cancel";
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="refresh" content="0; url=${redirectUrl}">
        <title>Redirecting...</title>
      </head>
      <body>
        <p>If you are not redirected automatically, <a href="${redirectUrl}">click here</a>.</p>
      </body>
    </html>
  `);
});

const startServer = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    initSocketServer(server);
    server.listen(PORT, () =>
      console.log(`Server is running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
