import VerificationController from '@controllers/api/VerificationsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /verify:
 *   post:
 *     tags:
 *      - "VERIFICATION"
 *     summary: User verification
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        schema:
 *          type: "object"
 *          properties:
 *            code:
 *              type: "string"
 *              description: "Verification code"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal errror.
 *     security:
 *      - Bearer: []
 */
router.post('/', VerificationController.verify);

export default router;
