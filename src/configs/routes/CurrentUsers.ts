import CurrentUserController from '@controllers/api/CurrentUsersController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /me/:
 *   patch:
 *     tags:
 *      - "CURRENT USER"
 *     summary: Update current user information
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        schema:
 *          type: "object"
 *          properties:
 *            fullName:
 *              type: "string"
 *              description: "Full name"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.patch('/', CurrentUserController.update);

export default router;
