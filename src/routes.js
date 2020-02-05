import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import ShipperController from './app/controllers/ShipperController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

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

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
