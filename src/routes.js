import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import ShipperController from './app/controllers/ShipperController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import GetDeliveryController from './app/controllers/GetDeliveryController';
import EndDeliveryController from './app/controllers/EndDeliveryController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// ROUTES

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.get('/shipper/:shipperId/deliveries', GetDeliveryController.index);
routes.put(
  '/shipper/:shipperId/deliveries/:deliveryId',
  GetDeliveryController.update
);

routes.put(
  '/shipper/:shipperId/deliveries/:deliveryId/close',
  EndDeliveryController.update
);

// Required to logon
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/shippers', ShipperController.store);
routes.get('/shippers', ShipperController.index);
routes.delete('/shippers/:shipperId', ShipperController.destroy);
routes.put('/shippers/:shipperId', ShipperController.update);

routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.index);
routes.delete('/deliveries/:deliveryId', DeliveryController.destroy);
routes.put('/deliveries/:deliveryId', DeliveryController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
