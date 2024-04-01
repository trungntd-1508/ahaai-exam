import VerificationController from '@controllers/api/VerificationsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /verifications/send:
 *   post:
 *     tags:
 *      - "VERIFICATION"
 *     summary: Send verification
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        schema:
 *          type: "object"
 *          properties:
 *            email:
 *              type: "string"
 *              description: "Email"
 *            password:
 *              type: "string"
 *              description: "Password"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal errror.
 *     security:
 *      - Bearer: []
 */
router.post('/send', VerificationController.create);

/**
 * @openapi
 * /verifications/verify:
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
router.post('/verify', VerificationController.verify);

export default router;
