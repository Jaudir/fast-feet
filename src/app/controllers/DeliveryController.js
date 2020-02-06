import * as Yup from 'yup';
import Delivery from '../models/Delivery';

import Shipper from '../models/Shipper';
import File from '../models/File';
import Recipient from '../models/Recipient';

import Queue from '../../lib/Queue';
import CancellationDeliveryMail from '../jobs/CancellationDeliveryMail';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      shipper_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Delivery.create(req.body);

    return res.json(delivery);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const deliveries = await Delivery.findAll({
      where: { canceled_at: null },
      offset: (page - 1) * 20,
      include: [
        {
          model: Shipper,
          as: 'shipper',
          attributes: ['id', 'name'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'number', 'zipcode'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.number(),
      shipper_id: Yup.number(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Delivery.findByPk(req.params.deliveryId);

    const update_delivery = await delivery.update(req.body);

    return res.json(update_delivery);
  }

  async destroy(req, res) {
    const delivery = await Delivery.findByPk(req.params.deliveryId, {
      include: [
        {
          model: Shipper,
          as: 'shipper',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'number', 'zipcode', 'street', 'city', 'state'],
        },
      ],
    });

    delivery.canceled_at = new Date();

    await delivery.save();

    await Queue.add(CancellationDeliveryMail.key, {
      delivery,
    });

    return res.json(delivery);
  }
}

export default new DeliveryController();
