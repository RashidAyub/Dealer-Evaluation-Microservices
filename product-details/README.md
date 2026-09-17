# Product Details Microservice

Part of the **Dealer Evaluation – Microservices Application** project.

## Overview
This Python/Flask microservice serves product catalog information, technical specifications, MSRP values, and the associated supplier dealer identifiers required by the Dealer Evaluation frontend.

## Technology Stack
- **Language**: Python 3.9+
- **Framework**: Flask
- **Middleware**: `flask-cors` (CORS enabled for cross-origin frontend communication)
- **Production WSGI Server**: Gunicorn
- **Deployment Platform**: IBM Cloud Code Engine

## Local Development & Setup

### Prerequisites
- Python 3.9 or higher installed
- `pip` package manager

### Installation
1. Navigate into the `product-details` directory:
   ```bash
   cd product-details
   ```

2. (Optional but recommended) Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the microservice:
   ```bash
   python app.py
   ```
   The service will start on `http://localhost:5000`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` or `/health` | Health check endpoint for Code Engine probes |
| `GET` | `/products` | Get list of all products |
| `GET` | `/products?category=Electric+SUV` | Filter products by category |
| `GET` | `/products/<product_id>` | Get details for a specific product (e.g. `P101`) |
| `GET` | `/categories` | Get list of all product categories |

### Sample Response: `GET /products`
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "P101",
      "name": "Apex Horizon EV",
      "category": "Electric SUV",
      "msrp": 48500,
      "description": "Dual-motor all-wheel-drive electric SUV with ultra-fast charging.",
      "specs": {
        "powertrain": "Dual Electric Motors (AWD)",
        "range": "310 miles",
        "horsepower": "380 hp",
        "acceleration_0_60": "4.2 sec"
      },
      "supplier_dealer_ids": ["D101", "D102", "D103", "D105"]
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
  --name product-details-service \
  --build-source . \
  --port 5000 \
  --min-scale 1 \
  --max-scale 2
```
