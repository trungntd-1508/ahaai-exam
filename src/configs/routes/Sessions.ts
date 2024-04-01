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
  * /sessions/google:
  *   get:
  *     tags:
  *      - "SESSION"
  *     summary: Login via google
  *     responses:
  *       200:
  *         description: Success.
  *       500:
  *         description: Internal errror.
  *     security:
  *      - Bearer: []
  */
router.get('/google', passport.authenticate('google', { session: false, scope: ['email'] }));

/**
 * @openapi
 * /sessions/google/callback:
 *   get:
 *     tags:
 *      - "SESSION"
 *     summary: Callback google OAuth
 *     responses:
 *       200:
 *         description: Success.
 *       500:
 *         description: Internal errror.
 *     security:
 *      - Bearer: []
 */
router.get('/google/callback', passport.authenticate('google', { session: false, scope: ['email'] }), SessionController.newWithGoogle);

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
