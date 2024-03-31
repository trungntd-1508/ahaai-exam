import PasswordController from '@controllers/api/PasswordsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /passwords:
 *   patch:
 *     tags:
 *      - "PASSWORD"
 *     summary: Change password
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        schema:
 *          type: "object"
 *          properties:
 *            currentPassword:
 *              type: "string"
 *              description: "Current password"
 *            password:
 *              type: "string"
 *              description: "New password"
 *            passwordConfirmation:
 *              type: "string"
 *              description: "New password confirmation"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal errror.
 *     security:
 *      - Bearer: []
 */
router.patch('/', PasswordController.update);

export default router;
