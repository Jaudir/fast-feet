import { Op } from 'sequelize';
// import File from '../models/File';
// import Recipient from '../models/Recipient';
// import Shipper from '../models/Shipper';
import Delivery from '../models/Delivery';

class ShipperAccessDeliveryControlle {
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
    return res.json();
  }
}

export default new ShipperAccessDeliveryControlle();
