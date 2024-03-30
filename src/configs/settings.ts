import dotenv from 'dotenv';

dotenv.config();

export default {
  jwtSecret: process.env.JWT_SECRET || 'H6O6ddY0Gpw61CS0YRiNob8pq23vCr2S',
  sessionSecret: 'bUfxkJXG5xOtaOqRyTmXqWGl4ZxNSyAPbJGVfc7DKix2lyBMJn6TtmKQER52q2eC',
};
