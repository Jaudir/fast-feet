import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

import Queue from '../../lib/Queue';

import Shipper from '../models/Shipper';
import Recipient from '../models/Recipient';
import CancellationDeliveryMail from '../jobs/CancellationDeliveryMail';

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
    const { problemId } = req.params;

    const problem = await DeliveryProblem.findByPk(problemId);

    if (!problem) {
      return res.status(401).json({ error: 'Problem  not found!' });
    }
    const deliveryId = problem.delivery_id;
    const delivery = await Delivery.findByPk(deliveryId, {
      include: [
        {
          model: Shipper,
          as: 'shipper',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'number', 'zipcode', 'street', 'city', 'state'],
        },
      ],
    });

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery not found!' });
    }

    if (delivery.canceled_at !== null) {
      return res.status(401).json({ error: 'Delivery already canceled' });
    }
    delivery.canceled_at = new Date();

    await delivery.save();

    await Queue.add(CancellationDeliveryMail.key, {
      delivery,
    });

    return res.json({ problem, delivery });
  }
}

export default new DeliveryProblemsController();
