import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

import Shipper from '../models/Shipper';
import Recipient from '../models/Recipient';

class DeliveryProblemsController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const problems = await DeliveryProblem.findAll({
      include: [
        {
          model: Delivery,
          as: 'delivery',
          include: [
            {
              model: Shipper,
              as: 'shipper',
              attributes: ['name'],
            },
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['name'],
            },
          ],
        },
      ],
      offset: (page - 1) * 20,
    });

    return res.json(problems);
  }

  async destroy(req, res) {
    return res.json();
  }
}

export default new DeliveryProblemsController();
