# Dealer Pricing Microservice

Part of the **Dealer Evaluation – Microservices Application** project.

## Overview
This Node.js/Express microservice provides dealer profiles, product-specific dealer pricing quotations, dealer discounts against MSRP, inventory status, and delivery estimates.

## Technology Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Middleware**: `cors` (Cross-Origin Resource Sharing enabled for frontend requests)
- **Deployment Platform**: IBM Cloud Code Engine

## Local Development & Setup

### Prerequisites
- Node.js (v18 or higher)
- `npm` (Node Package Manager)

### Installation
1. Navigate into the `dealer-pricing` directory:
   ```bash
   cd dealer-pricing
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the service:
   ```bash
   npm start
   ```
   Or run in live-reload development mode:
   ```bash
   npm run dev
   ```
   The service will start on `http://localhost:5001`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` or `/health` | Health check endpoint for Code Engine probes |
| `GET` | `/dealers` | Get list of all registered dealers |
| `GET` | `/dealers/:dealerId` | Get profile for a specific dealer (e.g. `D101`) |
| `GET` | `/pricing` | Get all pricing records (supports `?productId=P101&dealerId=D101`) |
| `GET` | `/pricing/product/:productId` | Get all dealer quotes for a product (sorted best price first) |
| `GET` | `/pricing/product/:productId/dealer/:dealerId` | Get specific dealer offer for a product |

### Sample Response: `GET /pricing/product/P101`
```json
{
  "success": true,
  "productId": "P101",
  "count": 4,
  "lowestPrice": 46200,
  "data": [
    {
      "productId": "P101",
      "dealerId": "D103",
      "offeredPrice": 46200,
      "dealerDiscount": 2300,
      "financingAPR": "2.9% (48 mos)",
      "stockStatus": "Arriving in 3 days (6 units allocated)",
      "deliveryEstimate": "4-6 business days",
      "dealer": {
        "id": "D103",
        "name": "Great Lakes Fleet & Auto",
        "location": "Detroit, MI",
        "rating": 4.6,
        "phone": "(313) 555-0199",
        "warranty": "4-Year / 50,000 mi Standard Care"
      }
    }
  ]
}
```

## IBM Cloud Code Engine Deployment

Deploy directly from source directory or container registry:

```bash
# 1. Target your resource group and project
ibmcloud target -g <YOUR_RESOURCE_GROUP>
ibmcloud ce project select -n <YOUR_PROJECT_NAME>

# 2. Deploy application from local source directory
ibmcloud ce app create \
  --name dealer-pricing-service \
  --build-source . \
  --port 5001 \
  --min-scale 1 \
  --max-scale 2
```
