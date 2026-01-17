# Production-Ready Payment Gateway

A robust, asynchronous payment gateway with job queues, webhook delivery, and an embeddable SDK.

## Features

- **Async Payment Processing**: Payments are processed in the background using Redis job queues.
- **Webhook Delivery**: Reliable webhook delivery with exponential backoff retries and HMAC signatures.
- **Refund Management**: Full and partial refunds with status updates (`partially_refunded`, `refunded`).
- **Embeddable SDK**: Easy-to-integrate JS SDK for merchants.
- **Merchant Dashboard**: Real-time analytics, transaction logs, and webhook configuration.

## Prerequisites

- Docker & Docker Compose
- Node.js (for running verification scripts)

## Setup & Running

1.  **Start Services**:
    ```bash
    docker-compose up -d --build
    ```
    This starts:
    - API (Port 8000)
    - Worker Service
    - Postgres DB (Port 5432)
    - Redis (Port 6379)
    - Dashboard (Port 3000)
    - Checkout Page (Port 3001)

2.  **Verify Services**:
    - Dashboard: `http://localhost:3000`
    - API Health: `http://localhost:8000/health`

## API Documentation

### Payments

- `POST /api/v1/payments`: Create a payment (Async).
- `GET /api/v1/payments/:id`: Get payment status.
- `POST /api/v1/payments/:id/capture`: Capture a payment.

### Refunds

- `POST /api/v1/payments/:id/refunds`: Initiate a refund.
- `GET /api/v1/refunds/:id`: Get refund details.

### Webhooks

- `GET /api/v1/webhooks`: List webhook logs.
- `POST /api/v1/webhooks/:id/retry`: Retry a failed webhook.
- `PUT /api/v1/merchants/me`: Update webhook URL.

## Webhook Integration

Merchants can configure their webhook URL in the dashboard.
To verify signatures:

```javascript
const signature = req.headers['x-webhook-signature'];
const expected = crypto.createHmac('sha256', SECRET).update(JSON.stringify(req.body)).digest('hex');
if (signature === expected) { /* Verified */ }
```

## SDK Integration

Include the SDK and initialize:

```html
<script src="http://localhost:3001/checkout.js"></script>
<script>
  const gateway = new PaymentGateway({
    key: 'PUBLIC_KEY',
    orderId: 'order_123',
    onSuccess: (data) => console.log(data),
    onFailure: (err) => console.error(err)
  });
  gateway.open();
</script>
```

## Testing

Run the included verification scripts:

- `node verify_async.js`: Test async payment flow.
- `node verify_refund_status.js`: Test refund flow and partial/full refund status updates.
