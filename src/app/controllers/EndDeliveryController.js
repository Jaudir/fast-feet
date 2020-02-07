import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import File from '../models/File';

class EndDeliveryController {
  async update(req, res) {
    const schema = Yup.object().shape({
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
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

    if (delivery.start_date === null) {
      return res
        .status(401)
        .json({ error: 'This delivery was not take out yet.' });
    }

    if (delivery.end_date !== null) {
      return res.status(401).json({ error: 'This delivery already closed.' });
    }

    const { signature_id } = req.body;

    const file = await File.findByPk(signature_id);

    if (!file) {
      return res.status(401).json({ error: 'File not found.' });
    }

    delivery.update({
      start_date: new Date(),
      signature_id,
    });

    await delivery.save();

    return res.json(delivery);
  }
}

export default new EndDeliveryController();
