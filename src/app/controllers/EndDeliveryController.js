import { Op } from 'sequelize';
import { endOfToday, startOfToday } from 'date-fns';

import Delivery from '../models/Delivery';
import File from '../models/File';

class GetDeliveryControlle {
  async update(req, res) {
    const { deliveryId, shipperId } = req.params;

    const delivery = await Delivery.findByPk(deliveryId);

    if (shipperId !== delivery.shipper_id) {
      return res.status(401).json({ error: 'You can not edit this delivery!' });
    }

    delivery.end_date = new Date();

    await delivery.save();

    return res.json();
  }
}

export default new GetDeliveryControlle();
