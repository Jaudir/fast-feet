import * as Yup from 'yup';
import Shipper from '../models/Shipper';
import File from '../models/File';

class ShipperController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const ShipperExists = await Shipper.findOne({
      where: { email: req.body.email },
    });

    if (ShipperExists) {
      return res.status(400).json({ error: 'Shipper already exists.' });
    }

    const { id, name, email } = await Shipper.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const shippers = await Shipper.findAll({
      where: { disable: false },
      order: ['name'],
      attributes: ['id', 'name', 'email', 'disable'],
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });
    return res.json(shippers);
  }

  async destroy(req, res) {
    const shipper = await Shipper.findByPk(req.params.shipperId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    shipper.disable = true;

    await shipper.save();

    return res.send(shipper);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      disable: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const shipper = await Shipper.findByPk(req.params.shipperId);
    let { email } = req.body;
    if (email && email !== shipper.email) {
      const shipperExists = await Shipper.findOne({
        where: { email },
      });

      if (shipperExists) {
        return res.status(400).json({ error: 'Email already exists.' });
      }
    }

    const { id, name, disable } = await shipper.update(req.body);
    email = shipper.email;

    return res.json({
      id,
      name,
      email,
      disable,
    });
  }
}

export default new ShipperController();
