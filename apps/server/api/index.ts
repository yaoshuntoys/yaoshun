import { createApp } from "../src/main";

type RequestHandler = (req: unknown, res: unknown) => unknown;

let cachedServer: RequestHandler | undefined;

export default async function handler(req: unknown, res: unknown) {
  if (!cachedServer) {
    const app = await createApp();
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance() as RequestHandler;
  }

  return cachedServer(req, res);
}
