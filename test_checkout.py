import requests
import json
import time

BASE_URL = "http://localhost:5000/api"

def test_purchase_submit():
    order_payload = {
        "productId": 12,
        "playerID": "12345",
        "serverID": "1234",
        "paymentMethod": "abapayway"
    }
    res = requests.post(f"{BASE_URL}/orders", json=order_payload)
    order_id = res.json().get('orderId')
    
    payload = {
        "orderId": order_id,
        "amount": 0.05
    }
    res = requests.post(f"{BASE_URL}/PayWay/create", json=payload)
    data = res.json()
    
    form_data = data.get('formData', {})
    purchase_url = data.get('purchaseUrl')
    
    print("Received FormData:", form_data)
    print("Submitting to ABA PayWay...", purchase_url)
    
    aba_res = requests.post(purchase_url, data=form_data)
    
    print("\n--- ABA PAYWAY RESPONSE ---")
    print("Status Code:", aba_res.status_code)
    print("Response Text/HTML:")
    print(aba_res.text[:2000])

if __name__ == "__main__":
    test_purchase_submit()
