import { config } from 'dotenv';
config();

if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}

import { run } from '@/commands';
import { APP_URL, PORT, TOKEN } from '@/constants/config';
import { scdl } from '@/services/soundcloud';
import { Client, Intents } from 'discord.js';
import log from 'fancy-log';
import herokuAwake from 'heroku-awake';
import express, { Request, Response } from 'express';

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_INTEGRATIONS,
  ],
});

client.on('ready', () => {
  log.info(`> Bot is on ready as ${client?.user?.tag}`);
});

const app = express();
app.get('/', (_req: Request, res: Response) => {
  return res.status(200).send({
    message: 'Misabot is running',
  });
});

app.listen(PORT, async () => {
  log.info(`> Server is listening on port ${PORT}`);
  herokuAwake(APP_URL);
  await client.login(TOKEN);
  await scdl.connect();
  run(client);
});
