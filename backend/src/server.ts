import { createServer } from 'http';
import app from './app.js';
import { env } from './config/env.js';

const server = createServer(app);
const port = env.PORT;

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});


