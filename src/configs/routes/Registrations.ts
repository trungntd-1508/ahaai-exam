import RegistrationController from '@controllers/api/RegistrationsController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /register:
 *   post:
 *     tags:
 *      - "REGISTRATION"
 *     summary: Registration
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
 *            passwordConfirmation:
 *              type: "string"
 *              description: "Password confirmation"
 *            fullName:
 *              type: "string"
 *              description: "Full name"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal errror.
 *     security:
 *      - Bearer: []
 */
router.post('/', RegistrationController.create);

export default router;
