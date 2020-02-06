import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { delivery, shipper, recipient } = data;
    Mail.sendMail({
      to: `${shipper.name} <${shipper.email}>`,
      subject: 'Nova encomenda registrada',
      template: 'delivery_new',
      context: {
        deliveryId: delivery.id,
        client: recipient.name,
        product: delivery.product,
        shipper: shipper.name,
        address: recipient,
      },
    });
  }
}

export default new NewDeliveryMail();
