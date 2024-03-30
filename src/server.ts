/* eslint-disable import/first */
require('module-alias/register');

import path from 'path';
import express from 'express';
import compression from 'compression';
import session from 'express-session';
import cors from 'cors';
import sequelize from '@initializers/sequelize';
import strongParams from '@middlewares/parameters';
import { morganLogger } from '@middlewares/morgan';
import routes from '@configs/routes';
import Settings from '@configs/settings';
import formidable from 'express-formidable';
import cronJobs from './jobs';

const port = process.env.PORT || 3000;

const app = express();
app.use(compression());
app.use(express.urlencoded({
  extended: true,
}));
app.use(formidable({ multiples: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: Settings.sessionSecret,
}));

app.use(cors());
app.options('*', cors());
app.use(morganLogger());
app.use(strongParams());

app.use('/api/v1', routes);

app.use((req, res) => {
  res.status(404).send({ url: `${req.path} not found` });
});

sequelize.authenticate().then(() => {
  sequelize.query('SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,\'ONLY_FULL_GROUP_BY\',\'\'));');
  app.listen(port, () => {
    console.log(`App is running localhost:${port}`);
    console.log('  Press CTRL-C to stop\n');
  });
  cronJobs();
});
