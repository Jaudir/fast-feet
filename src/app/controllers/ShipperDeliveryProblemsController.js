import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class ShipperDeliveryProblemsController {
  async index(req, res) {
    return res.json();
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });
    const { deliveryId } = req.params;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery do not exists.' });
    }

    const bodyProblem = {
      description: req.body.description,
      delivery_id: Number(deliveryId),
    };
    const problem = await DeliveryProblem.create(bodyProblem);

    return res.json(problem);
  }
}

export default new ShipperDeliveryProblemsController();
