import os
from datetime import datetime
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://peakmao007_db_user:DNelqTteMX30a7PX@pudeth.olrum6s.mongodb.net/?appName=pudeth&retryWrites=true&w=majority"

def seed_mongodb():
    print("[*] Connecting to MongoDB Atlas cluster 'pudeth'...")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
    db = client["mlbbtopup"]

    # Remove temporary ping document
    if "test_ping" in db.list_collection_names():
        db.drop_collection("test_ping")

    # 1. Products Collection
    products_col = db["products"]
    products_col.create_index("product_id", unique=True)
    products_col.create_index("diamond_amount")

    classic_prices = [
        {"product_id": 1, "diamond_amount": 11, "price": 0.20, "cost_price": 0.17, "reseller_price": 0.19, "name": "11 Diamonds", "desc": "11 Diamonds (10 + 1 Bonus)", "status": "Active"},
        {"product_id": 2, "diamond_amount": 55, "price": 0.95, "cost_price": 0.74, "reseller_price": 0.95, "name": "55 Diamonds", "desc": "55 Diamonds Starter", "status": "Active"},
        {"product_id": 3, "diamond_amount": 86, "price": 1.35, "cost_price": 1.17, "reseller_price": 1.35, "name": "86 Diamonds", "desc": "86 Diamonds Bonus", "status": "Active"},
        {"product_id": 4, "diamond_amount": 110, "price": 1.70, "cost_price": 1.45, "reseller_price": 1.70, "name": "110 Diamonds", "desc": "110 Diamonds Bonus", "status": "Active"},
        {"product_id": 5, "diamond_amount": 165, "price": 2.40, "cost_price": 2.22, "reseller_price": 2.40, "name": "165 Diamonds", "desc": "165 Diamonds (Hot Deal)", "status": "Active"},
        {"product_id": 6, "diamond_amount": 172, "price": 2.50, "cost_price": 2.31, "reseller_price": 2.50, "name": "172 Diamonds", "desc": "172 Diamonds Standard", "status": "Active"},
        {"product_id": 7, "diamond_amount": 210, "price": 1.55, "cost_price": 1.45, "reseller_price": 1.55, "name": "Weekly Pass", "desc": "Weekly Pass (220 Diamonds + 70 Aurora)", "status": "Active"},
        {"product_id": 8, "diamond_amount": 440, "price": 3.10, "cost_price": 2.90, "reseller_price": 3.10, "name": "2 Weekly Pass", "desc": "2 Weekly Pass (440 Diamonds + 140 Aurora)", "status": "Active"},
        {"product_id": 9, "diamond_amount": 660, "price": 4.65, "cost_price": 4.35, "reseller_price": 4.65, "name": "3 Weekly Pass", "desc": "3 Weekly Pass (29 tickets)", "status": "Active"},
        {"product_id": 10, "diamond_amount": 880, "price": 6.20, "cost_price": 5.80, "reseller_price": 6.20, "name": "4 Weekly Pass", "desc": "4 Weekly Pass Bundle", "status": "Active"},
        {"product_id": 11, "diamond_amount": 1100, "price": 7.75, "cost_price": 7.25, "reseller_price": 7.75, "name": "5 Weekly Pass", "desc": "5 Weekly Pass Bundle", "status": "Active"},
        {"product_id": 12, "diamond_amount": 1320, "price": 9.30, "cost_price": 8.70, "reseller_price": 9.30, "name": "6 Weekly Pass", "desc": "6 Weekly Pass Bundle", "status": "Active"},
        {"product_id": 13, "diamond_amount": 605, "price": 5.50, "cost_price": 5.12, "reseller_price": 5.50, "name": "165 + 2Weekly", "desc": "165 Diamonds + 2 Weekly Passes", "status": "Active"},
        {"product_id": 14, "diamond_amount": 257, "price": 3.69, "cost_price": 3.34, "reseller_price": 3.69, "name": "257 Diamonds", "desc": "257 Diamonds Popular", "status": "Active"},
        {"product_id": 15, "diamond_amount": 275, "price": 3.85, "cost_price": 3.55, "reseller_price": 3.85, "name": "275 Diamonds", "desc": "275 Diamonds (29 tickets)", "status": "Active"},
        {"product_id": 16, "diamond_amount": 312, "price": 4.55, "cost_price": 3.88, "reseller_price": 4.55, "name": "312 Diamonds", "desc": "312 Diamonds (Starlight Ready)", "status": "Active"},
        {"product_id": 17, "diamond_amount": 343, "price": 4.99, "cost_price": 4.25, "reseller_price": 4.99, "name": "343 Diamonds", "desc": "343 Diamonds (29 tickets)", "status": "Active"},
        {"product_id": 18, "diamond_amount": 429, "price": 6.30, "cost_price": 5.68, "reseller_price": 6.30, "name": "429 Diamonds", "desc": "429 Diamonds (29 tickets)", "status": "Active"},
        {"product_id": 19, "diamond_amount": 500, "price": 8.50, "cost_price": 7.64, "reseller_price": 8.50, "name": "Twilight Pass", "desc": "VIP Twilight Pass", "status": "Active"},
        {"product_id": 20, "diamond_amount": 514, "price": 7.35, "cost_price": 6.28, "reseller_price": 7.35, "name": "514 Diamonds", "desc": "514 Diamonds Best Value", "status": "Active"},
        {"product_id": 21, "diamond_amount": 565, "price": 7.80, "cost_price": 7.31, "reseller_price": 7.80, "name": "565 Diamonds", "desc": "565 Diamonds Special", "status": "Active"},
        {"product_id": 22, "diamond_amount": 600, "price": 8.50, "cost_price": 7.25, "reseller_price": 8.50, "name": "600 Diamonds", "desc": "600 Diamonds Pro Pack", "status": "Active"},
        {"product_id": 23, "diamond_amount": 706, "price": 9.99, "cost_price": 9.08, "reseller_price": 9.99, "name": "706 Diamonds", "desc": "706 Diamonds VIP", "status": "Active"},
        {"product_id": 24, "diamond_amount": 878, "price": 12.80, "cost_price": 10.90, "reseller_price": 12.80, "name": "878 Diamonds", "desc": "878 Diamonds VIP PRO", "status": "Active"},
        {"product_id": 25, "diamond_amount": 963, "price": 13.60, "cost_price": 11.60, "reseller_price": 13.60, "name": "963 Diamonds", "desc": "963 Diamonds Grand Pack", "status": "Active"},
        {"product_id": 26, "diamond_amount": 1050, "price": 15.50, "cost_price": 13.20, "reseller_price": 15.50, "name": "1050 Diamonds", "desc": "1050 Diamonds Royal Chest", "status": "Active"},
        {"product_id": 27, "diamond_amount": 1412, "price": 22.00, "cost_price": 18.80, "reseller_price": 22.00, "name": "1412 Diamonds", "desc": "1412 Diamonds Treasury", "status": "Active"},
        {"product_id": 28, "diamond_amount": 2195, "price": 29.99, "cost_price": 27.49, "reseller_price": 29.99, "name": "2195 Diamonds", "desc": "2195 Diamonds Mythic Pack", "status": "Active"},
        {"product_id": 29, "diamond_amount": 2452, "price": 32.50, "cost_price": 27.70, "reseller_price": 32.50, "name": "2452 Diamonds", "desc": "2452 Diamonds Mythic Plus", "status": "Active"},
        {"product_id": 30, "diamond_amount": 2901, "price": 39.99, "cost_price": 34.00, "reseller_price": 39.99, "name": "2901 Diamonds", "desc": "2901 Diamonds Legendary Pack", "status": "Active"},
        {"product_id": 31, "diamond_amount": 3688, "price": 49.99, "cost_price": 45.86, "reseller_price": 49.99, "name": "3688 Diamonds", "desc": "3688 Diamonds Epic Vault", "status": "Active"},
        {"product_id": 32, "diamond_amount": 4390, "price": 62.99, "cost_price": 53.60, "reseller_price": 62.99, "name": "4390 Diamonds", "desc": "4390 Diamonds Supreme Chest", "status": "Active"},
        {"product_id": 33, "diamond_amount": 5532, "price": 73.99, "cost_price": 69.24, "reseller_price": 73.99, "name": "5532 Diamonds", "desc": "5532 Diamonds Immortal Pack", "status": "Active"},
        {"product_id": 34, "diamond_amount": 6944, "price": 92.99, "cost_price": 79.20, "reseller_price": 92.99, "name": "6944 Diamonds", "desc": "6944 Diamonds Titan Pack", "status": "Active"},
        {"product_id": 35, "diamond_amount": 9288, "price": 125.00, "cost_price": 115.00, "reseller_price": 125.00, "name": "9288 Diamonds", "desc": "9288 Diamonds ULTIMATE", "status": "Active"}
    ]

    for p in classic_prices:
        p["updated_at"] = datetime.utcnow().isoformat()
        products_col.update_one({"diamond_amount": p["diamond_amount"]}, {"$set": p}, upsert=True)
    print(f"[+] Synced {len(classic_prices)} products to MongoDB Atlas collection 'products'.")

    # 2. Users Collection (Admin)
    users_col = db["users"]
    users_col.create_index("email", unique=True)
    users_col.update_one(
        {"email": "admin@mlbbtopup.com"},
        {"$set": {
            "name": "Super Admin",
            "email": "admin@mlbbtopup.com",
            "role": "Admin",
            "created_at": datetime.utcnow().isoformat()
        }},
        upsert=True
    )
    print("[+] Created Admin User in MongoDB Atlas collection 'users'.")

    # 3. Settings Collection
    settings_col = db["settings"]
    settings_col.update_one(
        {"type": "bakong_khqr"},
        {"$set": {
            "merchant_bakong_id": "deth_peak3@aclb",
            "merchant_name": "PuDeth Smart-PAY",
            "merchant_city": "PHNOM PENH",
            "acquiring_bank": "FAMILY PHONE",
            "currency_default": "USD",
            "updated_at": datetime.utcnow().isoformat()
        }},
        upsert=True
    )
    print("[+] Synced Settings in MongoDB Atlas collection 'settings'.")

    # 4. Ensure payments & orders indexes
    payments_col = db["payments"]
    payments_col.create_index("md5_hash", unique=True)
    payments_col.create_index("bill_number")
    payments_col.create_index("status")

    orders_col = db["orders"]
    orders_col.create_index("order_id")
    orders_col.create_index("player_id")
    orders_col.create_index("status")

    print("[+] All collections initialized successfully in MongoDB database 'mlbbtopup'!")
    print("[+] Collections in 'mlbbtopup':", db.list_collection_names())

if __name__ == "__main__":
    seed_mongodb()
