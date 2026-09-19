import { app } from "./src/app";
import { settings } from "./src/configs/settings";

export default { port: settings.port, fetch: app.fetch };
