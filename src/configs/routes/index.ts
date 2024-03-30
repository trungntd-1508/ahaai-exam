import { Request, Response, Router } from 'express';
import { sendSuccess } from '@libs/response';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  sendSuccess(res, { });
});

export default router;
