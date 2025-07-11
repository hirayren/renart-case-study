from flask import Flask, jsonify
from flask_cors import CORS
import json
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Altın fiyatını almak için örnek API
def get_gold_price():
    try:
        response = requests.get(
            "https://www.goldapi.io/api/XAU/USD",
            headers={
                "x-access-token": os.getenv("GOLD_API_KEY"),
                "Content-Type": "application/json"
            }
        )
        data = response.json()
        return float(data["price"])
    except:
        return 70.0  # fallback değer

@app.route("/products", methods=["GET"])
def get_products():
    with open("data\products.json", "r") as f:
        products = json.load(f)

    gold_price = get_gold_price()

    enriched_products = []
    for product in products:
        price = round((product["popularityScore"] + 1) * product["weight"] * gold_price, 2)
        rating = round(product["popularityScore"] * 5, 1)

        enriched = {
            "name": product["name"],
            "images": product["images"],
            "weight": product["weight"],
            "popularityScore": product["popularityScore"],
            "rating": rating,
            "price": price
        }
        enriched_products.append(enriched)

    return jsonify(enriched_products)

if __name__ == "__main__":
    app.run(debug=True)