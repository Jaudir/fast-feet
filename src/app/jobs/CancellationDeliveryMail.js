import Mail from '../../lib/Mail';

class CancellationDeliveryMail {
  get key() {
    return 'CancellationDeliveryMail';
  }

  async handle({ data }) {
    const { delivery } = data;
    Mail.sendMail({
      to: `${delivery.shipper.name} <${delivery.shipper.email}>`,
      subject: 'Encomenda cancelada',
      template: 'cancellation',
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

export default new CancellationDeliveryMail();
