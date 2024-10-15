import cors from "cors";
import express from "express";
import { IncomingMessage } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { WS_REQ_TYPE, WS_RES_TYPE } from "../constants/api.ts";
import { getBaseWsRes } from "../utils/helper/apiHelper.ts";
import { getLinkItemFromSitemap } from "./sitemap.ts";
import { checkUrlExist } from "./utils.ts";

const app = express();
const port = 3000;

const corsOptions: cors.CorsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (_: express.Request, res: express.Response) => {
  res.send("Server is running!");
});

app.post("/api/scan", (req: express.Request, res: express.Response) => {
  const { clientId } = req.body;
  if (!clientId) {
    res.status(400).send("Client ID is not exist");
    return;
  }

  const ws = clients.get(clientId);
  if (!ws) {
    res.status(400).send("Client ID is not exist");
    return;
  }

  ws.send(JSON.stringify({ type: WS_RES_TYPE.START, data: "URL is Exist" }));
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

/* -------------------------------------------------------------------------- */
/*                                  WebSocket                                 */
/* -------------------------------------------------------------------------- */
const wss = new WebSocketServer({ server });
const clients = new Map<string, WebSocket>();

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  const clientId = req.url?.split("clientId=")[1];
  if (clientId) {
    clients.set(clientId, ws);
  } else {
    ws.send(
      JSON.stringify({
        type: WS_RES_TYPE.ERROR,
        data: "Client ID is not exist",
      })
    );
  }

  ws.on("message", async (message: string) => {
    console.log(`Received message => ${message}`);
    const { type, data } = JSON.parse(message.toString());
    if (type && data) {
      switch (type) {
        case WS_REQ_TYPE.CRAWLER_URL:
        case WS_REQ_TYPE.SITEMAP_URL: {
          const { isExist, statusCode } = await checkUrlExist(data);
          if (isExist) {
            if (type === WS_REQ_TYPE.SITEMAP_URL) {
              // sitemap scan
              getLinkItemFromSitemap(data, ws);
            }
            if (type === WS_REQ_TYPE.CRAWLER_URL) {
              // crawler scan
            }
          } else {
            ws.send(
              getBaseWsRes(
                WS_RES_TYPE.ERROR,
                "URL is not Exist, statusCode: " + statusCode
              )
            );
          }
          break;
        }
      }
    } else {
      ws.send(getBaseWsRes(WS_RES_TYPE.ERROR, "Invalid request data"));
    }
  });
});
