import { connect } from 'mongoose';
import app from './app';
import { port, url, cron_conf } from './config';
import cron from 'node-cron';
import { followUpProcess } from './helpers/followUpHelper';

(async () => {
  await connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  app.listen(port);
  cron.schedule(cron_conf, followUpProcess);
  console.log(`App listening on port ${port}...`);
})();
