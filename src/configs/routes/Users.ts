import UserController from '@controllers/api/UsersController';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /users/:
 *   get:
 *     tags:
 *      - "USER"
 *     summary: Users list
 *     parameters:
 *      - in: query
 *        name: "page"
 *        description: "page"
 *        type: "string"
 *      - in: query
 *        name: "limit"
 *        description: "limit"
 *        type: "string"
 *      - in: query
 *        name: "freeWord"
 *        description: "Keyword to find"
 *        type: "string"
 *     responses:
 *       200:
 *         description: "Success"
 *       500:
 *        description: Internal error
 *     security:
 *      - Bearer: []
 */
router.get('/', UserController.index);

export default router;
