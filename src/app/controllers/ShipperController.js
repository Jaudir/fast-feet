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
      order: ['name'],
      attributes: ['id', 'name', 'email'],
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
    return res.send();
  }

  async update(req, res) {
    return res.send();
  }
}

export default new ShipperController();
