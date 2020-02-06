import Mail from '../../lib/Mail';

class NewDeliveryMail {
  get key() {
    return 'NewDeliveryMail';
  }

  async handle({ data }) {
    const { fullDelivery: delivery } = data;
    Mail.sendMail({
      to: `${delivery.shipper.name} <${delivery.shipper.email}>`,
      subject: 'Nova encomenda registrada',
      template: 'delivery_new',
      context: {
        deliveryId: delivery.id,
        client: delivery.recipient.name,
        product: delivery.product,
        shipper: delivery.shipper.name,
        address: delivery.recipient,
      },
    });
  }
}

export default new NewDeliveryMail();
