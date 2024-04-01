import { Request, Router, Response } from 'express';
import StatisticController from '@controllers/api/StatisticsController';

const router = Router();

/**
 * @openapi
 * /statistics:
 *   get:
 *     tags:
 *      - "STATISTIC"
 *     summary: Statistics
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal error.
 *     security:
 *      - Bearer: []
 */
router.get('/', (req: Request, res: Response) => StatisticController.show(req, res));

export default router;
