import dotenv from 'dotenv';

dotenv.config();

export default {
  defaultPerPage: '12',
  mailjetTemplateMapping: {
    accountActivation: 5851698,
  },
  jwt: {
    secret: 'jUqnH0tFwdgqX1lLa97OGCFOPMscAGN4IIlx4YaX3vt6ff546IRhCB3qeUz9kYP4',
    ttl: 60 * 60 * 24 * 7,
  },
  sessionSecret: 'bUfxkJXG5xOtaOqRyTmXqWGl4ZxNSyAPbJGVfc7DKix2lyBMJn6TtmKQER52q2eC',
};
