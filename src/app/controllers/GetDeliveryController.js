import { Op } from 'sequelize';
import { endOfToday, startOfToday } from 'date-fns';

import Delivery from '../models/Delivery';

class GetDeliveryController {
  async index(req, res) {
    const { option = 'todo' } = req.query;
    let date;

    if (option === 'todo') {
      date = null;
    } else if (option === 'done') {
      date = { [Op.ne]: null };
    }

    const deliveries = await Delivery.findAll({
      where: {
        shipper_id: req.params.shipperId,
        canceled_at: null,
        end_date: date,
      },
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const { deliveryId, shipperId } = req.params;

    const delivery = await Delivery.findByPk(deliveryId);

    if (Number(shipperId) !== delivery.shipper_id) {
      return res
        .status(401)
        .json({ error: 'You do not have permission to edit this delivery!' });
    }

    if (delivery.canceled_at !== null) {
      return res.status(401).json({ error: 'This delivery was canceled.' });
    }

    if (delivery.start_date !== null) {
      return res
        .status(401)
        .json({ error: 'This delivery already tooked out' });
    }

    if (delivery.end_date !== null) {
      return res.status(401).json({ error: 'This delivery already delivered' });
    }

    const deliveries = await Delivery.findAndCountAll({
      where: {
        start_date: {
          [Op.between]: [startOfToday(), endOfToday()],
        },
        shipper_id: shipperId,
      },
    });

    if (deliveries.count > 5) {
      return res
        .status(401)
        .json({ error: 'You reach the limit of take outs!' });
    }

    delivery.start_date = new Date();

    await delivery.save();

    return res.json(delivery);
  }
}

export default new GetDeliveryController();
