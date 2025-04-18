import express from "express";
import { DiscordBot } from "./discord/index.ts";
import { Logger } from "./logger/index.ts";
import { MCPClient } from "./mcp/client.ts";
import authenticationRouter from "./routers/authentication.ts";
import mcpRouter from "./routers/mcp.ts";
import queueRouters from "./routers/queue.ts";

const app = express();

app.use(authenticationRouter);
app.use(mcpRouter);
app.use(express.json());
app.use(queueRouters);

const port = Bun.env.PORT;

if (!port) {
  throw new Error("PORT not set");
}
app.listen(port, async () => {
  Logger.info("HTTP Server", `API is running on port ${port}`);
  await MCPClient.getInstance().connectToServer();
  if (Bun.env.ENABLE_DISCORD === "true") {
    await DiscordBot.getInstance().connect();
  }
});
