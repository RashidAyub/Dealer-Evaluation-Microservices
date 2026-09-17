"""
Product Details Microservice
JavaScript Professional Certificate - Final Project Lab
Framework: Python / Flask
Provides product catalogue and specification data for Dealer Evaluation frontend.
"""

import os
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger("product-details-service")

app = Flask(__name__)

# Enable CORS for all routes (to allow requests from frontend and other services)
CORS(app, resources={r"/*": {"origins": "*"}})

# Sample Product Catalogue Data
PRODUCTS = [
    {
        "id": "P101",
        "name": "Apex Horizon EV",
        "category": "Electric SUV",
        "msrp": 48500,
        "description": "Dual-motor all-wheel-drive electric SUV with ultra-fast charging and advanced driver assistance.",
        "specs": {
            "powertrain": "Dual Electric Motors (AWD)",
            "range": "310 miles",
            "horsepower": "380 hp",
            "acceleration_0_60": "4.2 sec"
        },
        "supplier_dealer_ids": ["D101", "D102", "D103", "D105"]
    },
    {
        "id": "P102",
        "name": "Solaria Hybrid Cross",
        "category": "Compact Hybrid",
        "msrp": 29800,
        "description": "Fuel-efficient crossover featuring hybrid synergy drive and spacious 5-passenger cabin.",
        "specs": {
            "powertrain": "2.5L 4-Cylinder Hybrid",
            "fuel_economy": "48 MPG Combined",
            "horsepower": "219 hp",
            "cargo_volume": "37.5 cu ft"
        },
        "supplier_dealer_ids": ["D101", "D103", "D104"]
    },
    {
        "id": "P103",
        "name": "Titan Forge V8 Truck",
        "category": "Heavy-Duty Truck",
        "msrp": 54200,
        "description": "Commercial-grade pickup truck built for maximum payload, extreme towing, and durability.",
        "specs": {
            "powertrain": "6.2L V8 Engine",
            "towing_capacity": "12,500 lbs",
            "horsepower": "420 hp",
            "bed_length": "6.5 ft"
        },
        "supplier_dealer_ids": ["D102", "D104", "D105"]
    },
    {
        "id": "P104",
        "name": "Veloce Executive Sedan",
        "category": "Luxury Sedan",
        "msrp": 42900,
        "description": "Executive sports sedan with handcrafted leather interior, panoramic glass roof, and adaptive suspension.",
        "specs": {
            "powertrain": "2.0L Turbocharged I4",
            "fuel_economy": "32 MPG Hwy",
            "horsepower": "280 hp",
            "sound_system": "14-Speaker Premium Audio"
        },
        "supplier_dealer_ids": ["D101", "D102", "D104", "D105"]
    },
    {
        "id": "P105",
        "name": "Urban Pulse E-Hatch",
        "category": "Urban Hatchback",
        "msrp": 24500,
        "description": "Compact city car optimized for urban commuting, tight parking, and zero emissions.",
        "specs": {
            "powertrain": "Single Motor (FWD)",
            "range": "180 miles",
            "horsepower": "170 hp",
            "turning_radius": "32 ft"
        },
        "supplier_dealer_ids": ["D102", "D103"]
    }
]


# =============================================================================
# HEALTH CHECK ENDPOINTS
# =============================================================================

@app.route("/", methods=["GET"])
@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint for IBM Cloud Code Engine probes and status verification."""
    return jsonify({
        "status": "UP",
        "service": "product-details-microservice",
        "version": "1.0.0",
        "total_products": len(PRODUCTS)
    }), 200


# =============================================================================
# PRODUCT ENDPOINTS
# =============================================================================

@app.route("/products", methods=["GET"])
def get_products():
    """
    Retrieve all products.
    Optional query parameter: ?category=<category_name>
    """
    category_filter = request.args.get("category")
    if category_filter:
        filtered = [
            p for p in PRODUCTS
            if p["category"].lower() == category_filter.lower()
        ]
        return jsonify({
            "success": True,
            "count": len(filtered),
            "data": filtered
        }), 200

    return jsonify({
        "success": True,
        "count": len(PRODUCTS),
        "data": PRODUCTS
    }), 200


@app.route("/products/<product_id>", methods=["GET"])
def get_product_by_id(product_id):
    """Retrieve detailed information for a single product by its unique ID."""
    product = next((p for p in PRODUCTS if p["id"].lower() == product_id.lower()), None)
    
    if not product:
        logger.warning(f"Product not found: {product_id}")
        return jsonify({
            "success": False,
            "error": "PRODUCT_NOT_FOUND",
            "message": f"Product with ID '{product_id}' was not found in the catalogue."
        }), 404

    return jsonify({
        "success": True,
        "data": product
    }), 200


@app.route("/categories", methods=["GET"])
def get_categories():
    """Retrieve all unique product categories."""
    categories = sorted(list({p["category"] for p in PRODUCTS}))
    return jsonify({
        "success": True,
        "count": len(categories),
        "data": categories
    }), 200


# =============================================================================
# ERROR HANDLERS
# =============================================================================

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({
        "success": False,
        "error": "ENDPOINT_NOT_FOUND",
        "message": "The requested API endpoint does not exist."
    }), 404


@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({
        "success": False,
        "error": "INTERNAL_SERVER_ERROR",
        "message": "An unexpected error occurred on the server."
    }), 500


if __name__ == "__main__":
    # Port is configurable via environment variable PORT (required by IBM Cloud Code Engine)
    port = int(os.environ.get("PORT", 5000))
    logger.info(f"Starting Product Details Microservice on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
