/**
 * Dealer Evaluation Frontend Application
 * JavaScript Professional Certificate - Final Project Lab
 * Pure Vanilla JavaScript (ES6+)
 */

// =============================================================================
// API CONFIGURATION
// Retrieves endpoints from the window placeholders defined in index.html
// =============================================================================
const PRODUCT_API_BASE = (window.PRODUCT_DETAILS_API_URL || "http://localhost:5000").replace(/\/$/, "");
const PRICING_API_BASE = (window.DEALER_PRICING_API_URL || "http://localhost:5001").replace(/\/$/, "");

// Application State
let currentProducts = [];
let selectedProduct = null;
let currentDealerQuotes = [];
let allDealers = [];

// DOM Element References
const elements = {
  // Navigation status
  pillProduct: document.getElementById('pill-product-service'),
  pillPricing: document.getElementById('pill-dealer-service'),
  statusProductText: document.getElementById('status-product-text'),
  statusPricingText: document.getElementById('status-pricing-text'),
  btnRefreshStatus: document.getElementById('btn-refresh-status'),

  // Form controls
  productSelect: document.getElementById('product-select'),
  dealerSelect: document.getElementById('dealer-select'),
  productHelper: document.getElementById('product-helper'),
  dealerHelper: document.getElementById('dealer-helper'),

  // Notification banner
  alertBanner: document.getElementById('alert-banner'),
  alertIcon: document.getElementById('alert-icon'),
  alertTitle: document.getElementById('alert-title'),
  alertMessage: document.getElementById('alert-message'),
  btnCloseAlert: document.getElementById('btn-close-alert'),

  // Product details
  productCard: document.getElementById('product-details-card'),
  productCategory: document.getElementById('product-category'),
  productName: document.getElementById('product-name'),
  productMsrp: document.getElementById('product-msrp'),
  productDescription: document.getElementById('product-description'),
  productSpecs: document.getElementById('product-specs'),

  // Pricing results
  resultsSection: document.getElementById('pricing-results-section'),
  resultsHeading: document.getElementById('results-heading'),
  resultsCount: document.getElementById('results-count'),
  singleDealerContainer: document.getElementById('single-dealer-container'),
  allDealersContainer: document.getElementById('all-dealers-container'),

  // Empty state
  emptyState: document.getElementById('empty-state')
};

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  checkApiHealth();
  loadProducts();
});

function setupEventListeners() {
  elements.btnRefreshStatus.addEventListener('click', () => {
    checkApiHealth();
    if (!currentProducts.length) {
      loadProducts();
    }
  });

  elements.productSelect.addEventListener('change', handleProductChange);
  elements.dealerSelect.addEventListener('change', handleDealerChange);

  elements.btnCloseAlert.addEventListener('click', () => {
    elements.alertBanner.classList.add('hidden');
  });
}

// =============================================================================
// API HEALTH CHECK
// =============================================================================

async function checkApiHealth() {
  // Check Product Details Microservice
  try {
    const res = await fetch(`${PRODUCT_API_BASE}/health`, { method: 'GET' });
    if (res.ok) {
      updateServicePill(elements.pillProduct, elements.statusProductText, true, 'Online (Python)');
    } else {
      updateServicePill(elements.pillProduct, elements.statusProductText, false, `Error (${res.status})`);
    }
  } catch (err) {
    updateServicePill(elements.pillProduct, elements.statusProductText, false, 'Offline');
  }

  // Check Dealer Pricing Microservice
  try {
    const res = await fetch(`${PRICING_API_BASE}/health`, { method: 'GET' });
    if (res.ok) {
      updateServicePill(elements.pillPricing, elements.statusPricingText, true, 'Online (Node.js)');
    } else {
      updateServicePill(elements.pillPricing, elements.statusPricingText, false, `Error (${res.status})`);
    }
  } catch (err) {
    updateServicePill(elements.pillPricing, elements.statusPricingText, false, 'Offline');
  }
}

function updateServicePill(pillEl, textEl, isOnline, message) {
  const dot = pillEl.querySelector('.status-dot');
  dot.className = 'status-dot ' + (isOnline ? 'dot-online' : 'dot-offline');
  textEl.textContent = message;
}

// =============================================================================
// DATA FETCHING: PRODUCTS
// =============================================================================

async function loadProducts() {
  elements.productSelect.disabled = true;
  elements.productSelect.innerHTML = '<option value="">Loading products from API...</option>';
  elements.productHelper.textContent = 'Connecting to Product Details microservice...';

  try {
    const res = await fetch(`${PRODUCT_API_BASE}/products`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch products.`);
    }

    const data = await res.json();
    currentProducts = data.data || [];

    if (currentProducts.length === 0) {
      showAlert('warning', 'No Products Found', 'The Product Details service returned an empty catalog.');
      elements.productSelect.innerHTML = '<option value="">No products available</option>';
      return;
    }

    // Populate dropdown
    elements.productSelect.innerHTML = '<option value="" selected disabled>-- Select a Vehicle / Product --</option>';
    currentProducts.forEach(prod => {
      const opt = document.createElement('option');
      opt.value = prod.id;
      opt.textContent = `${prod.name} (${prod.category}) - MSRP $${prod.msrp.toLocaleString()}`;
      elements.productSelect.appendChild(opt);
    });

    elements.productSelect.disabled = false;
    elements.productHelper.textContent = `${currentProducts.length} products loaded successfully.`;
  } catch (error) {
    console.error('Error loading products:', error);
    elements.productSelect.innerHTML = '<option value="">Failed to load products</option>';
    elements.productHelper.textContent = 'Backend service unreachable.';
    showAlert(
      'error',
      'Product Details Microservice Unreachable',
      `Unable to connect to ${PRODUCT_API_BASE}/products. Please ensure the Python microservice is running locally (python app.py) or verify your IBM Cloud Code Engine URL placeholder in index.html.`
    );
  }
}

// =============================================================================
// EVENT HANDLER: PRODUCT SELECTION
// =============================================================================

async function handleProductChange(e) {
  const productId = e.target.value;
  selectedProduct = currentProducts.find(p => p.id === productId);

  if (!selectedProduct) return;

  // Render Product Details Card
  renderProductCard(selectedProduct);

  // Reset & Prepare Dealer Selection Dropdown
  elements.dealerSelect.disabled = true;
  elements.dealerSelect.innerHTML = '<option value="">Loading authorized dealers...</option>';
  elements.dealerHelper.textContent = 'Fetching quotes from Dealer Pricing microservice...';

  // Hide previous pricing results
  elements.pricingResultsSection = elements.resultsSection;
  elements.resultsSection.classList.add('hidden');
  elements.emptyState.classList.add('hidden');

  try {
    // Query dealer pricing for this product
    const res = await fetch(`${PRICING_API_BASE}/pricing/product/${productId}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch pricing for product ${productId}`);
    }

    const data = await res.json();
    currentDealerQuotes = data.data || [];

    // Populate Dealer Dropdown
    elements.dealerSelect.innerHTML = `
      <option value="" selected disabled>-- Choose Dealer View --</option>
      <option value="all">⭐ ALL DEALERS (Compare All ${currentDealerQuotes.length} Offers)</option>
    `;

    currentDealerQuotes.forEach(quote => {
      const dealer = quote.dealer;
      const opt = document.createElement('option');
      opt.value = dealer.id;
      opt.textContent = `${dealer.name} — $${quote.offeredPrice.toLocaleString()} (${dealer.location})`;
      elements.dealerSelect.appendChild(opt);
    });

    elements.dealerSelect.disabled = false;
    elements.dealerHelper.textContent = `${currentDealerQuotes.length} dealer quotations available for this product.`;

    // Automatically display All Dealers comparison by default for quick grading overview
    elements.dealerSelect.value = 'all';
    renderAllDealersComparison(currentDealerQuotes, selectedProduct);

  } catch (error) {
    console.error('Error fetching dealer pricing:', error);
    elements.dealerSelect.innerHTML = '<option value="">Failed to load dealers</option>';
    elements.dealerHelper.textContent = 'Dealer Pricing microservice unreachable.';
    showAlert(
      'error',
      'Dealer Pricing Microservice Unreachable',
      `Unable to fetch dealer quotes from ${PRICING_API_BASE}/pricing/product/${productId}. Please ensure the Node.js microservice is running (node server.js) or verify your Code Engine URL in index.html.`
    );
  }
}

// =============================================================================
// EVENT HANDLER: DEALER SELECTION
// =============================================================================

function handleDealerChange(e) {
  const selectedDealerId = e.target.value;

  if (!selectedDealerId || !selectedProduct) return;

  if (selectedDealerId === 'all') {
    renderAllDealersComparison(currentDealerQuotes, selectedProduct);
  } else {
    const singleQuote = currentDealerQuotes.find(q => q.dealerId === selectedDealerId);
    if (singleQuote) {
      renderSingleDealerQuote(singleQuote, selectedProduct);
    }
  }
}

// =============================================================================
// RENDERING FUNCTIONS
// =============================================================================

function renderProductCard(product) {
  elements.productCategory.textContent = product.category;
  elements.productName.textContent = product.name;
  elements.productMsrp.textContent = `$${product.msrp.toLocaleString()}`;
  elements.productDescription.textContent = product.description;

  // Render specifications
  elements.productSpecs.innerHTML = '';
  if (product.specs) {
    Object.entries(product.specs).forEach(([key, val]) => {
      const formattedKey = key.replace(/_/g, ' ');
      const specEl = document.createElement('div');
      specEl.className = 'spec-item';
      specEl.innerHTML = `
        <span class="spec-key">${formattedKey}</span>
        <span class="spec-val">${val}</span>
      `;
      elements.productSpecs.appendChild(specEl);
    });
  }

  elements.productCard.classList.remove('hidden');
}

function renderSingleDealerQuote(quote, product) {
  const dealer = quote.dealer;
  const msrpSavings = product.msrp - quote.offeredPrice;
  const savingsPercent = ((msrpSavings / product.msrp) * 100).toFixed(1);

  elements.resultsHeading.textContent = `Dealer Offer: ${dealer.name}`;
  elements.resultsCount.textContent = `1 Dealer Selected`;

  elements.singleDealerContainer.innerHTML = `
    <div class="single-dealer-card">
      <div class="dealer-main-info">
        <div>
          <div class="dealer-name">
            ${dealer.name}
            ${dealer.certified ? '<span class="badge" style="background:#e0f2fe; color:#0369a1;">Certified Dealer</span>' : ''}
          </div>
          <div class="dealer-location">📍 ${dealer.location} • 📞 ${dealer.phone} • ✉️ ${dealer.email}</div>
        </div>
        <div class="price-box">
          <span class="price-label">Quoted Dealer Price</span>
          <div class="price-figure">$${quote.offeredPrice.toLocaleString()}</div>
          ${msrpSavings > 0 ? `
            <div class="savings-tag">
              ✓ Save $${msrpSavings.toLocaleString()} (${savingsPercent}% below MSRP)
            </div>
          ` : ''}
        </div>
      </div>

      <div class="dealer-details-grid">
        <div class="detail-block">
          <div class="detail-icon">⭐</div>
          <div class="detail-content">
            <span class="detail-label">Customer Rating</span>
            <span class="detail-value">${dealer.rating} / 5.0</span>
          </div>
        </div>

        <div class="detail-block">
          <div class="detail-icon">📦</div>
          <div class="detail-content">
            <span class="detail-label">Inventory Status</span>
            <span class="detail-value">${quote.stockStatus}</span>
          </div>
        </div>

        <div class="detail-block">
          <div class="detail-icon">⏱️</div>
          <div class="detail-content">
            <span class="detail-label">Delivery Estimate</span>
            <span class="detail-value">${quote.deliveryEstimate}</span>
          </div>
        </div>

        <div class="detail-block">
          <div class="detail-icon">💳</div>
          <div class="detail-content">
            <span class="detail-label">Financing APR</span>
            <span class="detail-value">${quote.financingAPR}</span>
          </div>
        </div>

        <div class="detail-block" style="grid-column: 1 / -1;">
          <div class="detail-icon">🛡️</div>
          <div class="detail-content">
            <span class="detail-label">Dealer Warranty</span>
            <span class="detail-value">${dealer.warranty}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  elements.allDealersContainer.classList.add('hidden');
  elements.singleDealerContainer.classList.remove('hidden');
  elements.resultsSection.classList.remove('hidden');
}

function renderAllDealersComparison(quotes, product) {
  if (!quotes || quotes.length === 0) return;

  // Lowest price offer
  const lowestPrice = Math.min(...quotes.map(q => q.offeredPrice));

  elements.resultsHeading.textContent = `All Authorized Dealers Comparison (${product.name})`;
  elements.resultsCount.textContent = `${quotes.length} Dealer Quotes`;

  let cardsHtml = '<div class="comparison-grid">';

  quotes.forEach(quote => {
    const dealer = quote.dealer;
    const isLowest = quote.offeredPrice === lowestPrice;
    const savings = product.msrp - quote.offeredPrice;
    const savingsPercent = ((savings / product.msrp) * 100).toFixed(1);

    cardsHtml += `
      <div class="dealer-quote-card ${isLowest ? 'best-price' : ''}">
        ${isLowest ? '<span class="best-price-badge">🏆 Lowest Price Offer</span>' : ''}
        
        <div>
          <div class="quote-header">
            <div class="quote-dealer-name">${dealer.name}</div>
            <div class="quote-dealer-meta">
              <span>📍 ${dealer.location}</span>
              <span>•</span>
              <span>⭐ ${dealer.rating}</span>
            </div>
          </div>

          <div class="quote-price-box">
            <div class="quote-offered-price">$${quote.offeredPrice.toLocaleString()}</div>
            ${savings > 0 ? `
              <div class="quote-savings">Save $${savings.toLocaleString()} (${savingsPercent}% off MSRP)</div>
            ` : '<div class="quote-savings" style="color:var(--text-muted)">At MSRP</div>'}
          </div>

          <ul class="quote-features">
            <li><span>Availability:</span> <strong>${quote.stockStatus}</strong></li>
            <li><span>Delivery:</span> <strong>${quote.deliveryEstimate}</strong></li>
            <li><span>Financing:</span> <strong>${quote.financingAPR}</strong></li>
            <li><span>Warranty:</span> <strong>${dealer.warranty}</strong></li>
            <li><span>Contact:</span> <strong>${dealer.phone}</strong></li>
          </ul>
        </div>

        <button class="btn-select-dealer" onclick="selectSpecificDealer('${dealer.id}')" style="
          width: 100%;
          padding: 0.65rem;
          background: ${isLowest ? 'var(--primary)' : 'var(--bg-surface-alt)'};
          color: ${isLowest ? '#ffffff' : 'var(--text-primary)'};
          border: 1px solid ${isLowest ? 'var(--primary)' : 'var(--border)'};
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition);
        ">
          View Dealer Details
        </button>
      </div>
    `;
  });

  cardsHtml += '</div>';

  elements.allDealersContainer.innerHTML = cardsHtml;
  elements.singleDealerContainer.classList.add('hidden');
  elements.allDealersContainer.classList.remove('hidden');
  elements.resultsSection.classList.remove('hidden');
}

// Global helper accessible by inline button clicks
window.selectSpecificDealer = function(dealerId) {
  elements.dealerSelect.value = dealerId;
  const singleQuote = currentDealerQuotes.find(q => q.dealerId === dealerId);
  if (singleQuote && selectedProduct) {
    renderSingleDealerQuote(singleQuote, selectedProduct);
  }
};

// =============================================================================
// ALERT NOTIFICATION HELPER
// =============================================================================

function showAlert(type, title, message) {
  elements.alertBanner.className = `alert-banner ${type}`;
  elements.alertTitle.textContent = title;
  elements.alertMessage.textContent = message;
  elements.alertIcon.textContent = type === 'error' ? '❌' : (type === 'warning' ? '⚠️' : 'ℹ️');
  elements.alertBanner.classList.remove('hidden');
}
