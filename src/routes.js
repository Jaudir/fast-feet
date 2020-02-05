import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import ShipperController from './app/controllers/ShipperController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// ROUTES

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

// Required to logon
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/shippers', ShipperController.store);
routes.get('/shippers', ShipperController.index);
routes.delete('/shippers/:shipperId', ShipperController.destroy);
routes.put('/shippers/:shipperId', ShipperController.update);

export default routes;
