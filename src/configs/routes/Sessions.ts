import SessionController from '@controllers/api/SessionsController';
import { passport } from '@middlewares/passport';
import { Router } from 'express';

const router = Router();

/**
 * @openapi
 * /sessions/login:
 *   post:
 *     tags:
 *      - "SESSION"
 *     summary: Login
 *     parameters:
 *      - in: "body"
 *        name: "body"
 *        schema:
 *          type: "object"
 *          properties:
 *            email:
 *              type: "string"
 *              description: "email"
 *            password:
 *              type: "string"
 *              description: "password"
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal errror.
 *     security:
 *      - Bearer: []
 */
router.post('/login', SessionController.create);

/**
  * @openapi
  * /sessions/current:
  *   get:
  *     tags:
  *      - "SESSION"
  *     summary: Get current session
  *     responses:
  *       200:
  *         description: Success
  *       500:
  *         description: Internal error
  *     security:
  *      - Bearer: []
 */

router.get('/current', passport.authenticate('jwt', { session: false }), SessionController.current);

export default router;
