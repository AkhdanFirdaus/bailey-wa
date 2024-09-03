import type { Express } from "express";
import { join } from "path";

export default (app: Express) => {
  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  });
};