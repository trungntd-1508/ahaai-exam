import { Request, Response, Router } from 'express';
import { sendSuccess } from '@libs/response';
import RegistrationRouter from './Registrations';
import SessionRouter from './Sessions';
import VerificationRouter from './Verifications';

const router = Router();

router.use('/register', RegistrationRouter);
router.use('/sessions', SessionRouter);
router.use('/verify', VerificationRouter);
router.get('/health', (req: Request, res: Response) => {
  sendSuccess(res, { });
});

export default router;
