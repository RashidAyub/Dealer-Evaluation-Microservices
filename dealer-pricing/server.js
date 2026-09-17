/**
 * Dealer Pricing Microservice
 * JavaScript Professional Certificate - Final Project Lab
 * Framework: Node.js / Express.js
 * Provides dealer information and product pricing data for Dealer Evaluation frontend.
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// =============================================================================
// SAMPLE DATA: DEALERS & PRICING
// =============================================================================

const DEALERS = [
  {
    id: 'D101',
    name: 'Metro Premier Auto Group',
    location: 'Chicago, IL',
    rating: 4.8,
    phone: '(312) 555-0144',
    email: 'sales@metropremier.com',
    warranty: '5-Year / 60,000 mi Comprehensive',
    certified: true
  },
  {
    id: 'D102',
    name: 'Summit Coast Motors',
    location: 'San Francisco, CA',
    rating: 4.9,
    phone: '(415) 555-0182',
    email: 'contact@summitcoast.com',
    warranty: '6-Year / 72,000 mi Platinum Elite',
    certified: true
  },
  {
    id: 'D103',
    name: 'Great Lakes Fleet & Auto',
    location: 'Detroit, MI',
    rating: 4.6,
    phone: '(313) 555-0199',
    email: 'info@greatlakesfleet.com',
    warranty: '4-Year / 50,000 mi Standard Care',
    certified: false
  },
  {
    id: 'D104',
    name: 'Lone Star Apex Dealerships',
    location: 'Dallas, TX',
    rating: 4.7,
    phone: '(214) 555-0177',
    email: 'quotes@lonestarapex.com',
    warranty: '5-Year / 60,000 mi Powertrain Plus',
    certified: true
  },
  {
    id: 'D105',
    name: 'Keystone State Auto Hub',
    location: 'Philadelphia, PA',
    rating: 4.5,
    phone: '(215) 555-0123',
    email: 'sales@keystoneautohub.com',
    warranty: '3-Year / 36,000 mi Factory Standard',
    certified: false
  }
];

// Pricing matrix mapping products to dealer quotes
const PRICING_DATA = [
  // Product P101: Apex Horizon EV (MSRP: $48,500)
  {
    productId: 'P101',
    dealerId: 'D101',
    offeredPrice: 46850,
    dealerDiscount: 1650,
    financingAPR: '1.9% (60 mos)',
    stockStatus: 'In Stock (4 units)',
    deliveryEstimate: 'Immediate pickup or 2 days local delivery'
  },
  {
    productId: 'P101',
    dealerId: 'D102',
    offeredPrice: 47200,
    dealerDiscount: 1300,
    financingAPR: '2.4% (60 mos)',
    stockStatus: 'In Stock (2 units)',
    deliveryEstimate: 'Immediate pickup'
  },
  {
    productId: 'P101',
    dealerId: 'D103',
    offeredPrice: 46200,
    dealerDiscount: 2300,
    financingAPR: '2.9% (48 mos)',
    stockStatus: 'Arriving in 3 days (6 units allocated)',
    deliveryEstimate: '4-6 business days'
  },
  {
    productId: 'P101',
    dealerId: 'D105',
    offeredPrice: 47990,
    dealerDiscount: 510,
    financingAPR: '3.4% (60 mos)',
    stockStatus: 'In Stock (1 unit)',
    deliveryEstimate: 'Same day handover'
  },

  // Product P102: Solaria Hybrid Cross (MSRP: $29,800)
  {
    productId: 'P102',
    dealerId: 'D101',
    offeredPrice: 28900,
    dealerDiscount: 900,
    financingAPR: '2.9% (60 mos)',
    stockStatus: 'In Stock (7 units)',
    deliveryEstimate: 'Immediate pickup'
  },
  {
    productId: 'P102',
    dealerId: 'D103',
    offeredPrice: 28450,
    dealerDiscount: 1350,
    financingAPR: '3.1% (60 mos)',
    stockStatus: 'In Stock (3 units)',
    deliveryEstimate: '2-3 business days'
  },
  {
    productId: 'P102',
    dealerId: 'D104',
    offeredPrice: 28700,
    dealerDiscount: 1100,
    financingAPR: '2.5% (60 mos)',
    stockStatus: 'In Stock (5 units)',
    deliveryEstimate: 'Immediate pickup'
  },

  // Product P103: Titan Forge V8 Truck (MSRP: $54,200)
  {
    productId: 'P103',
    dealerId: 'D102',
    offeredPrice: 52900,
    dealerDiscount: 1300,
    financingAPR: '3.9% (72 mos)',
    stockStatus: 'In Stock (2 units)',
    deliveryEstimate: 'Immediate delivery'
  },
  {
    productId: 'P103',
    dealerId: 'D104',
    offeredPrice: 51800,
    dealerDiscount: 2400,
    financingAPR: '2.9% (60 mos)',
    stockStatus: 'In Stock (5 units)',
    deliveryEstimate: 'Immediate pickup'
  },
  {
    productId: 'P103',
    dealerId: 'D105',
    offeredPrice: 53100,
    dealerDiscount: 1100,
    financingAPR: '3.5% (60 mos)',
    stockStatus: 'Factory order (Est. 2 weeks)',
    deliveryEstimate: '10-14 business days'
  },

  // Product P104: Veloce Executive Sedan (MSRP: $42,900)
  {
    productId: 'P104',
    dealerId: 'D101',
    offeredPrice: 41200,
    dealerDiscount: 1700,
    financingAPR: '1.9% (48 mos)',
    stockStatus: 'In Stock (3 units)',
    deliveryEstimate: 'Immediate pickup'
  },
  {
    productId: 'P104',
    dealerId: 'D102',
    offeredPrice: 40950,
    dealerDiscount: 1950,
    financingAPR: '2.2% (60 mos)',
    stockStatus: 'In Stock (2 units)',
    deliveryEstimate: '1-2 business days'
  },
  {
    productId: 'P104',
    dealerId: 'D104',
    offeredPrice: 41500,
    dealerDiscount: 1400,
    financingAPR: '2.8% (60 mos)',
    stockStatus: 'In Stock (4 units)',
    deliveryEstimate: 'Immediate pickup'
  },
  {
    productId: 'P104',
    dealerId: 'D105',
    offeredPrice: 41900,
    dealerDiscount: 1000,
    financingAPR: '3.2% (60 mos)',
    stockStatus: 'In Stock (1 unit)',
    deliveryEstimate: 'Same day pickup'
  },

  // Product P105: Urban Pulse E-Hatch (MSRP: $24,500)
  {
    productId: 'P105',
    dealerId: 'D102',
    offeredPrice: 23600,
    dealerDiscount: 900,
    financingAPR: '1.9% (60 mos)',
    stockStatus: 'In Stock (6 units)',
    deliveryEstimate: 'Immediate pickup'
  },
  {
    productId: 'P105',
    dealerId: 'D103',
    offeredPrice: 23200,
    dealerDiscount: 1300,
    financingAPR: '2.5% (48 mos)',
    stockStatus: 'In Stock (4 units)',
    deliveryEstimate: '2 business days'
  }
];

// Helper: Enrich pricing object with full dealer details
function enrichPricingWithDealer(pricingItem) {
  const dealer = DEALERS.find(d => d.id === pricingItem.dealerId);
  return {
    ...pricingItem,
    dealer: dealer || { id: pricingItem.dealerId, name: 'Unknown Dealer' }
  };
}

// =============================================================================
// HEALTH CHECK ENDPOINTS
// =============================================================================

app.get(['/', '/health'], (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'dealer-pricing-microservice',
    version: '1.0.0',
    total_dealers: DEALERS.length,
    total_pricing_entries: PRICING_DATA.length,
    uptime_seconds: Math.floor(process.uptime())
  });
});

// =============================================================================
// DEALER ENDPOINTS
// =============================================================================

// Get all dealers
app.get('/dealers', (req, res) => {
  res.status(200).json({
    success: true,
    count: DEALERS.length,
    data: DEALERS
  });
});

// Get single dealer by ID
app.get('/dealers/:dealerId', (req, res) => {
  const { dealerId } = req.params;
  const dealer = DEALERS.find(d => d.id.toLowerCase() === dealerId.toLowerCase());

  if (!dealer) {
    return res.status(404).json({
      success: false,
      error: 'DEALER_NOT_FOUND',
      message: `Dealer with ID '${dealerId}' was not found.`
    });
  }

  res.status(200).json({
    success: true,
    data: dealer
  });
});

// =============================================================================
// PRICING ENDPOINTS
// =============================================================================

// General pricing endpoint supporting optional query parameters
// Examples: /pricing, /pricing?productId=P101, /pricing?productId=P101&dealerId=D101
app.get('/pricing', (req, res) => {
  const { productId, dealerId } = req.query;
  let results = [...PRICING_DATA];

  if (productId) {
    results = results.filter(p => p.productId.toLowerCase() === productId.toLowerCase());
  }

  if (dealerId) {
    results = results.filter(p => p.dealerId.toLowerCase() === dealerId.toLowerCase());
  }

  const enriched = results.map(enrichPricingWithDealer);

  res.status(200).json({
    success: true,
    count: enriched.length,
    data: enriched
  });
});

// Get all dealer pricing for a specific product
app.get('/pricing/product/:productId', (req, res) => {
  const { productId } = req.params;
  const quotes = PRICING_DATA.filter(
    p => p.productId.toLowerCase() === productId.toLowerCase()
  );

  if (quotes.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'NO_PRICING_FOUND',
      message: `No dealer pricing found for product ID '${productId}'.`
    });
  }

  const enrichedQuotes = quotes.map(enrichPricingWithDealer);

  // Sort quotes by offeredPrice ascending (best deal first)
  enrichedQuotes.sort((a, b) => a.offeredPrice - b.offeredPrice);

  res.status(200).json({
    success: true,
    productId,
    count: enrichedQuotes.length,
    lowestPrice: enrichedQuotes[0].offeredPrice,
    data: enrichedQuotes
  });
});

// Get pricing for a specific product and specific dealer
app.get('/pricing/product/:productId/dealer/:dealerId', (req, res) => {
  const { productId, dealerId } = req.params;
  const quote = PRICING_DATA.find(
    p => p.productId.toLowerCase() === productId.toLowerCase() &&
         p.dealerId.toLowerCase() === dealerId.toLowerCase()
  );

  if (!quote) {
    return res.status(404).json({
      success: false,
      error: 'QUOTE_NOT_FOUND',
      message: `No pricing quote found for product '${productId}' from dealer '${dealerId}'.`
    });
  }

  res.status(200).json({
    success: true,
    data: enrichPricingWithDealer(quote)
  });
});

// =============================================================================
// ERROR HANDLING MIDDLEWARE
// =============================================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'ENDPOINT_NOT_FOUND',
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected internal error occurred in the dealer pricing service.'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Dealer Pricing Microservice running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
