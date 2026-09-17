# Dealer Evaluation Frontend Microservice

Part of the **Dealer Evaluation – Microservices Application** project.

## Overview
This lightweight, responsive single-page web application provides the user interface for evaluating vehicle products and dealer quotations. It communicates asynchronously with both the Python Product Details microservice and the Node.js Dealer Pricing microservice.

## Technology Stack
- **Structure**: HTML5 (Semantic elements)
- **Styling**: Vanilla CSS (Custom design system, CSS Grid/Flexbox, responsive)
- **Logic**: Vanilla JavaScript (ES6+ `async/await`, Fetch API)
- **Frameworks**: None (Zero framework dependencies to ensure strict lab compliance)
- **Deployment Platform**: IBM Cloud Code Engine (Static Web Application or Code Engine Application)

## Features
- Dynamic product catalogue dropdown populated from `PRODUCT_DETAILS_API_URL/products`.
- Live connection health indicator pills for both backend microservices.
- Detailed product cards showing technical specifications and MSRP.
- Dealer selection dropdown filtered dynamically by authorized suppliers.
- **Single Dealer View**: Detailed quotation breakdown, MSRP savings calculation, customer ratings, inventory status, financing APR, and warranty.
- **All Dealers Comparison View**: Side-by-side comparison cards highlighting the best (lowest) price deal, savings, and dealer credentials.

## API Placeholders Configuration

Located prominently in [`index.html`](./index.html) lines 18-28:

```html
<script>
  window.PRODUCT_DETAILS_API_URL = "http://localhost:5000";
  window.DEALER_PRICING_API_URL = "http://localhost:5001";
</script>
```

### Replacing for IBM Cloud Code Engine Deployment
After deploying both backend microservices to IBM Cloud Code Engine, retrieve their public application URLs and replace the placeholder values:

```html
<script>
  window.PRODUCT_DETAILS_API_URL = "https://product-details-service.<region>.codeengine.appdomain.cloud";
  window.DEALER_PRICING_API_URL = "https://dealer-pricing-service.<region>.codeengine.appdomain.cloud";
</script>
```

## Running Locally

Serve the frontend using any local HTTP web server:

### Option A: Using Python built-in server
```bash
cd dealer-evaluation-frontend
python -m http.server 8080
```
Then navigate to: `http://localhost:8080`

### Option B: Using Node `npx serve`
```bash
cd dealer-evaluation-frontend
npx serve -l 8080
```

### Option C: VS Code Live Server extension
Right-click `index.html` and choose **"Open with Live Server"**.
