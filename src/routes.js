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

/** Create new user admin */
routes.post('/users', UserController.store);

/** Create new auth session */
routes.post('/session', SessionController.store);

/** Get Id-shipper deliveries */
routes.get('/shipper/:shipperId/deliveries', GetDeliveryController.index);

/** Update the start date deliveryId */
routes.put(
  '/shipper/:shipperId/deliveries/:deliveryId',
  GetDeliveryController.update
);

/** Close the deliveryId
 * Updtate the end date deliveryId
 */
routes.put(
  '/shipper/:shipperId/deliveries/:deliveryId/close',
  EndDeliveryController.update
);

/** Required to logon */
routes.use(authMiddleware);

/** User Standard controllers */
routes.put('/users', UserController.update);

/** Recipient Standard controllers */
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

/** Shipper Standard controllers */
routes.post('/shippers', ShipperController.store);
routes.get('/shippers', ShipperController.index);
routes.delete('/shippers/:shipperId', ShipperController.destroy);
routes.put('/shippers/:shipperId', ShipperController.update);

/** Delivery Standard controllers */
routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.index);
routes.delete('/deliveries/:deliveryId', DeliveryController.destroy);
routes.put('/deliveries/:deliveryId', DeliveryController.update);

/** Upload a single file */
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
