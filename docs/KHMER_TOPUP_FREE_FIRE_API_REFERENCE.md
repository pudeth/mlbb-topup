# Khmer TopUp API Reference — Free Fire Top-Up Integration
> **Official Reseller & B2B Integration Protocol for Garena Free Fire**  
> **Source Base URL:** `https://khmer-topup.com/api/v1`  
> **Documentation URL:** `https://khmer-topup.com/api-docs`

---

## 1. Overview

Khmer TopUp provides automated B2B REST API endpoints allowing resellers, e-commerce storefronts, Telegram bots, and automated top-up services to programmatically top up **Garena Free Fire** accounts instantly.

Orders are deducted in real-time from your prepaid reseller wallet balance in **USD**.

### Key Specifications
- **Base Endpoint:** `https://khmer-topup.com/api/v1`
- **Protocol:** HTTPS / REST over JSON (UTF-8)
- **Fulfillment Time:** ~1 to 5 seconds (Automated asynchronous worker pool)
- **Rate Limit:** 120 requests/minute (Read endpoints), 60 requests/minute (`POST /orders`)
- **Required Game Identifier:** Player UID only (`server_id` is not required for Free Fire)

---

## 2. Authentication & Headers

Every authenticated request requires a secret API key obtained from your Khmer TopUp reseller dashboard.

Pass the key using either header:

```http
Authorization: Bearer kt_28c2640c86717199395d973670cf039a30ba2716
```
*— or —*
```http
X-API-Key: kt_28c2640c86717199395d973670cf039a30ba2716
```

### Response Headers & Attribution
All responses include server metadata:
```http
Content-Type: application/json; charset=utf-8
X-Powered-By: khmer-topup.com
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 119
X-RateLimit-Reset: 1784731858
```

---

## 3. Architecture & Integration Flow

```mermaid
sequenceDiagram
    autonumber
    actor Player as Free Fire Gamer
    participant Store as Reseller App / Bot
    participant KT as Khmer TopUp API (khmer-topup.com)
    participant Garena as Garena Free Fire Server

    Player->>Store: Enter Free Fire UID & Select Package
    Store->>KT: GET /api/v1/check?slug=freefire-sgmy&player_id={UID}
    KT-->>Store: 200 OK {"result":"valid", "nickname":"ShadowHunter"}
    Store-->>Player: Display Nickname for Confirmation & Collect Payment
    
    Player->>Store: Confirms Order & Pays
    Store->>KT: POST /api/v1/orders {package_id, player_id, reference}
    Note over KT: Deducts wallet balance & enqueues direct dispatch
    KT-->>Store: 200 OK {"order_code":"KT-...", "status":"processing"}
    
    KT->>Garena: Direct Diamond / Pass Credit
    Garena-->>KT: Dispatch Confirmed
    
    loop Status Polling (every 2-3s)
        Store->>KT: GET /api/v1/orders/{order_code}
        KT-->>Store: {"status":"completed"}
    end
    Store-->>Player: Instant Notification: Diamonds Delivered!
```

---

## 4. Free Fire Supported Game Slugs

Khmer TopUp supports all official Garena Free Fire regional clusters:

| Slug | Region / Market | UID Format | Server ID |
| :--- | :--- | :--- | :--- |
| `freefire-sgmy` | **Cambodia, Singapore, Malaysia** (Default) | 8-12 digits | *null* |
| `free-fire-kh-sg` | **Direct Cambodia / Singapore Server** | 8-12 digits | *null* |
| `freefire-global` | **International / Global Server** | 8-12 digits | *null* |
| `free-fire-bonuse` | **Official First-Topup Diamond Bonuses** | 8-12 digits | *null* |
| `freefire-indonesia`| **Indonesia (ID)** | 8-12 digits | *null* |
| `freefire-brazil` | **Brazil (BR)** | 8-12 digits | *null* |
| `freefire-latam` | **Latin America (LATAM)** | 8-12 digits | *null* |
| `freefire-middle-east`| **Middle East / North Africa (MENA)**| 8-12 digits | *null* |
| `freefire-bangladesh`| **Bangladesh (BD)** | 8-12 digits | *null* |
| `freefire-taiwan` | **Taiwan (TW)** | 8-12 digits | *null* |
| `freefire-vietnam`| **Vietnam (VN)** | 8-12 digits | *null* |

---

## 5. Free Fire Packages & Reseller Pricing Matrix

### 5.1 Store Retail Selling Prices & Profit Margin Breakdown (📦 Best Seller)
These prices match your store retail prices, with corresponding wholesale fulfillment costs from the Khmer TopUp B2B API:

| # | Package Name | Customer Retail Price | Wholesale API Cost | Reseller Net Profit | Promo Tag / Diamond Reward |
| :-: | :--- | :-: | :-: | :-: | :--- |
| 1 | **WeeklyLite** | **$0.39** | $0.32 | **+$0.07** | `ទទួលបាន 90 💎` |
| 2 | **2 Weeklylite** | **$0.78** | $0.63 | **+$0.15** | `ទទួលបាន 180 💎` |
| 3 | **Weekly** | **$1.65** | $1.57 | **+$0.08** | `ទទួលបាន 445 💎` |
| 4 | **2 Weekly** | **$3.30** | $3.12 | **+$0.18** | `ទទួលបាន 890 💎` |
| 5 | **3 Weekly** | **$5.00** | $4.67 | **+$0.33** | `Discount 5%` |
| 6 | **4 Weekly** | **$6.50** | $6.24 | **+$0.26** | `Discount 10%` |
| 7 | **520 + Weekly** | **$6.20** | $6.16 | **+$0.04** | `Discount 5%` |
| 8 | **Monthly** | **$7.65** | $7.76 | Base Rate | Monthly Pass |
| 9 | **2 Monthly** | **$15.30** | $15.03 | **+$0.27** | `ទទួលបាន 5000 💎` |
| 10 | **3 Monthly** | **$23.10** | $22.55 | **+$0.55** | `Discount 10%` |
| 11 | **4 Monthly** | **$30.80** | $30.06 | **+$0.74** | `ទទួលបាន 10000 💎` |
| 12 | **3 in 1 membership** | **$9.65** | $9.50 | **+$0.15** | `ទទួលបាន 3000 💎` |
| 13 | **Weekly + monthly** | **$9.30** | $9.33 | Base Rate | `ទទួលបាន 2910 💎` |
| 14 | **2Weekly+monthly** | **$18.60** | $18.15 | **+$0.45** | VIP Bundle |

### 5.2 Primary Region Wholesale Catalogue: `freefire-sgmy` (Cambodia / SG / MY)

| Package ID | Item Name | Quantity | Reseller Price (USD) | Category |
| :---: | :--- | :---: | :---: | :--- |
| **374** | 25 Diamonds | 25 💎 | **$0.24** | Diamonds |
| **391** | 100 Diamonds | 100 💎 | **$0.90** | Diamonds |
| **376** | 310 Diamonds | 310 💎 | **$2.74** | Diamonds |
| **377** | 520 Diamonds | 520 💎 | **$4.59** | Diamonds |
| **378** | 1060 Diamonds | 1,060 💎 | **$9.01** | Diamonds |
| **379** | 2180 Diamonds | 2,180 💎 | **$18.21** | Diamonds |
| **380** | 5600 Diamonds | 5,600 💎 | **$45.07** | Diamonds |
| **381** | 11500 Diamonds | 11,500 💎 | **$92.82** | Diamonds (Whale) |
| **384** | Weekly Lite | 1 Week | **$0.32** | Membership Pass |
| **5028** | Weekly Lite x2 | 2 Weeks | **$0.63** | Membership Pass |
| **5029** | Weekly Lite x3 | 3 Weeks | **$0.94** | Membership Pass |
| **383** | Weekly Membership | 1 Week | **$1.57** | Membership Pass |
| **5024** | Weekly Membership x2 | 2 Weeks | **$3.12** | Membership Pass |
| **5025** | Weekly Membership x3 | 3 Weeks | **$4.67** | Membership Pass |
| **4852** | Monthly Membership | 30 Days | **$7.76** | Membership Pass |
| **5021** | Monthly Membership x2 | 60 Days | **$15.03** | Membership Pass |
| **5022** | Monthly Membership x3 | 90 Days | **$22.55** | Membership Pass |
| **390** | Level Up Pass (Lvl 6) | Milestone | **$0.29** | Level Up Pass |
| **385** | Level Up Pass (Lvl 10) | Milestone | **$0.61** | Level Up Pass |
| **386** | Level Up Pass (Lvl 15) | Milestone | **$0.61** | Level Up Pass |
| **387** | Level Up Pass (Lvl 20) | Milestone | **$0.61** | Level Up Pass |
| **388** | Level Up Pass (Lvl 25) | Milestone | **$0.61** | Level Up Pass |
| **389** | Level Up Pass (Lvl 30) | Milestone | **$0.90** | Level Up Pass |

### 5.2 Direct Route: `free-fire-kh-sg`

| Package ID | Item Name | Diamonds | Reseller Price (USD) |
| :---: | :--- | :---: | :---: |
| **5292** | 20 Diamonds | 20 💎 | **$0.19** |
| **5293** | 40 Diamonds | 40 💎 | **$0.36** |
| **5294** | 100 Diamonds | 100 💎 | **$0.86** |
| **5295** | 205 Diamonds | 205 💎 | **$1.73** |
| **5298** | 420 Diamonds | 420 💎 | **$3.48** |
| **5299** | 650 Diamonds | 650 💎 | **$5.27** |
| **5296** | 1100 Diamonds | 1,100 💎 | **$8.68** |
| **5297** | 2250 Diamonds | 2,250 💎 | **$17.57** |
| **5142** | Weekly Lite Pass | 1 Week | **$0.32** |
| **5141** | Monthly Membership | 30 Days | **$7.53** |

### 5.3 Special Bonus Event: `free-fire-bonuse`

| Package ID | Item Name | Total Diamonds | Reseller Price (USD) |
| :---: | :--- | :---: | :---: |
| **5143** | 150 Diamonds Bonus | 150 💎 | **$0.90** |
| **5144** | 465 Diamonds Bonus | 465 💎 | **$2.91** |
| **5145** | 780 Diamonds Bonus | 780 💎 | **$4.85** |
| **5146** | 1590 Diamonds Bonus | 1,590 💎 | **$9.95** |
| **5147** | 3270 Diamonds Bonus | 3,270 💎 | **$19.99** |
| **5148** | 8400 Diamonds Bonus | 8,400 💎 | **$49.44** |

### 5.4 Dedicated Level Pass (កញ្ចប់ឡើង Level) Milestone Packages

Free Fire Level Up Passes grant progressive milestone diamonds as players rank up their account level:

| Milestone Level | Upstream Package ID | Wholesale Cost | Storefront Retail | Est. Diamonds | Slug |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **Level 6** | `390` | **$0.29** | **$0.29** | ~200 💎 | `freefire-sgmy` |
| **Level 10** | `385` | **$0.61** | **$0.61** | ~300 💎 | `freefire-sgmy` |
| **Level 15** | `386` | **$0.61** | **$0.61** | ~400 💎 | `freefire-sgmy` |
| **Level 20** | `387` | **$0.61** | **$0.61** | ~500 💎 | `freefire-sgmy` |
| **Level 25** | `388` | **$0.61** | **$0.61** | ~600 💎 | `freefire-sgmy` |
| **Level 30** | `389` | **$0.90** | **$0.90** | ~800 💎 | `freefire-sgmy` |

---

## 6. Endpoints Reference

### 6.1 Check Reseller Wallet Balance
```http
GET /api/v1/me
```
Returns your account username, role, and current wallet balance in USD.

#### Request Example (cURL)
```bash
curl -X GET "https://khmer-topup.com/api/v1/me" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Response (`200 OK`)
```json
{
  "username": "tin_topup",
  "role": "reseller",
  "balance": 150.25,
  "currency": "USD",
  "developer": "khmer-topup.com"
}
```

---

### 6.2 Retrieve Available Games & Real-time Prices
```http
GET /api/v1/games
```
Retrieves the complete catalogue of active games, package IDs, and tailored reseller prices.

#### Request Example
```bash
curl -X GET "https://khmer-topup.com/api/v1/games" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Response Filtered for Free Fire (`200 OK`)
```json
{
  "games": [
    {
      "slug": "freefire-sgmy",
      "name": "Free Fire",
      "id_label": "Player ID",
      "server_label": null,
      "packages": [
        { "package_id": 374, "name": "25 Diamonds", "price": 0.24, "tag": null },
        { "package_id": 391, "name": "100 Diamonds", "price": 0.90, "tag": "Popular" },
        { "package_id": 376, "name": "310 Diamonds", "price": 2.74, "tag": "Hot" },
        { "package_id": 383, "name": "Weekly", "price": 1.57, "tag": "Pass" }
      ]
    }
  ]
}
```

---

### 6.3 Verify Free Fire Account UID
```http
GET /api/v1/check?slug={slug}&player_id={player_id}
```
Verifies that a player's Free Fire UID exists before deducting money or placing an order.

#### Query Parameters
| Parameter | Type | Required | Description |
| :--- | :---: | :---: | :--- |
| `slug` | `string` | **Yes** | Free Fire slug (e.g. `freefire-sgmy` or `free-fire-kh-sg`) |
| `player_id` | `string` | **Yes** | Player's 8 to 12 digit numeric game UID |
| `server_id` | `string` | No | Omit or pass empty (Free Fire does not use numeric server zones) |

#### Request Example (cURL)
```bash
curl -X GET "https://khmer-topup.com/api/v1/check?slug=freefire-sgmy&player_id=14792636283" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Valid Response (`200 OK`)
```json
{
  "result": "valid",
  "nickname": "៚{PHAI}៚",
  "developer": "khmer-topup.com"
}
```

#### Invalid Response (`200 OK`)
```json
{
  "result": "invalid",
  "developer": "khmer-topup.com"
}
```

#### Result States
- `valid`: Player UID confirmed, returns in-game `nickname`. Safe to fulfill.
- `invalid`: UID does not exist on Garena servers. Reject user input.
- `unknown`: Upstream verification temporarily unavailable. Order is still accepted and will auto-refund if invalid.

---

### 6.4 Place Instant Free Fire Order
```http
POST /api/v1/orders
Content-Type: application/json
```
Submits a Free Fire top-up transaction. Wallet balance is deducted, and diamonds/passes are credited to the user's account immediately.

#### Request Body (JSON)
| Field | Type | Required | Description |
| :--- | :---: | :---: | :--- |
| `package_id` | `integer` | **Yes** | Khmer TopUp package ID (e.g. `391` for 100 Diamonds) |
| `player_id` | `string` | **Yes** | Free Fire Player UID (numeric) |
| `server_id` | `string` | No | Null or empty for Free Fire |
| `reference` | `string` | **Yes** | **Idempotency Key**: Unique string generated by your server. Prevents duplicate charges upon network retries. |

#### Request Example (cURL)
```bash
curl -X POST "https://khmer-topup.com/api/v1/orders" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "package_id": 391,
    "player_id": "14792636283",
    "reference": "FF-RES-8839102-1784732000"
  }'
```

#### Response (`200 OK`)
```json
{
  "order_code": "KT-824F9A01",
  "status": "processing",
  "game": "Free Fire",
  "package": "100 Diamonds",
  "player_id": "14792636283",
  "server_id": null,
  "price": 0.90,
  "balance": 149.35,
  "reference": "FF-RES-8839102-1784732000",
  "idempotent": false,
  "developer": "khmer-topup.com"
}
```

> **Idempotency Guarantee:** If a network timeout or connection reset occurs, retry with the exact same `reference`. The API will return `idempotent: true` and the existing `order_code` without double-charging your wallet.

---

### 6.5 Check Order Status
```http
GET /api/v1/orders/{order_code}
```
Query order completion state or final settlement.

#### Request Example (cURL)
```bash
curl -X GET "https://khmer-topup.com/api/v1/orders/KT-824F9A01" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### Response Completed (`200 OK`)
```json
{
  "order_code": "KT-824F9A01",
  "status": "completed",
  "game": "Free Fire",
  "package": "100 Diamonds",
  "player_id": "14792636283",
  "price": 0.90,
  "created_at": 1784732000.0,
  "developer": "khmer-topup.com"
}
```

#### Order Status Lifecycle
```
             ┌───────────────┐
             │  processing   │
             └───────┬───────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
  ┌──────────────┐        ┌──────────────┐
  │  completed   │        │   refunded   │
  └──────────────┘        └──────────────┘
(Delivered to UID)      (Wallet credited back)
```

---

## 7. Multi-Language Code Implementations

### Node.js / JavaScript (Axios)
```javascript
const axios = require('axios');

const API_KEY = process.env.KHMER_TOPUP_API_KEY || 'kt_28c2640c86717199395d973670cf039a30ba2716';
const client = axios.create({
  baseURL: 'https://khmer-topup.com/api/v1',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

async function topUpFreeFire(playerId, packageId, clientOrderId) {
  try {
    // 1. Verify Player UID
    const verifyRes = await client.get('/check', {
      params: { slug: 'freefire-sgmy', player_id: playerId }
    });
    
    if (verifyRes.data.result === 'invalid') {
      throw new Error(`Free Fire UID ${playerId} does not exist`);
    }
    
    console.log(`Verified Player: ${verifyRes.data.nickname}`);

    // 2. Dispatch Order
    const orderRes = await client.post('/orders', {
      package_id: packageId,
      player_id: playerId,
      reference: `FF-ORD-${clientOrderId}`
    });

    console.log(`Order placed successfully: ${orderRes.data.order_code}`);
    return orderRes.data;
  } catch (err) {
    console.error('Khmer TopUp Error:', err.response?.data || err.message);
    throw err;
  }
}
```

### Python 3
```python
import os
import requests

API_KEY = os.getenv("KHMER_TOPUP_API_KEY", "kt_28c2640c86717199395d973670cf039a30ba2716")
BASE_URL = "https://khmer-topup.com/api/v1"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def order_free_fire_diamonds(player_id: str, package_id: int, order_ref: str):
    # Step 1: Check account UID
    check_resp = requests.get(
        f"{BASE_URL}/check",
        params={"slug": "freefire-sgmy", "player_id": player_id},
        headers=headers,
        timeout=10
    )
    data = check_resp.json()
    if data.get("result") == "invalid":
        raise ValueError(f"Free Fire Player UID {player_id} is invalid.")
        
    print(f"UID Validated! In-game Name: {data.get('nickname')}")

    # Step 2: Post Order
    payload = {
        "package_id": package_id,
        "player_id": player_id,
        "reference": f"REF-{order_ref}"
    }
    order_resp = requests.post(f"{BASE_URL}/orders", json=payload, headers=headers, timeout=15)
    return order_resp.json()
```

### C# (.NET 8 / 9)
```csharp
using System.Net.Http.Json;
using System.Text.Json;

public class KhmerTopUpFreeFireClient
{
    private readonly HttpClient _http;

    public KhmerTopUpFreeFireClient(string apiKey)
    {
        _http = new HttpClient { BaseAddress = new Uri("https://khmer-topup.com/api/v1/") };
        _http.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
    }

    public async Task<string> PlaceFreeFireOrderAsync(string playerId, int packageId, string reference)
    {
        var payload = new
        {
            package_id = packageId,
            player_id = playerId,
            reference = reference
        };

        var response = await _http.PostAsJsonAsync("orders", payload);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        return json.GetProperty("order_code").GetString()!;
    }
}
```

### PHP
```php
<?php
$apiKey = "kt_28c2640c86717199395d973670cf039a30ba2716";
$url = "https://khmer-topup.com/api/v1/orders";

$payload = json_encode([
    "package_id" => 391, // 100 Diamonds
    "player_id"  => "14792636283",
    "reference"  => "PHP-FF-" . uniqid()
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $apiKey",
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>
```

---

## 8. HTTP Error Codes & Handling

| Status | Error Key | Cause | Action Required |
| :---: | :--- | :--- | :--- |
| `400` | `bad_request` | Missing `package_id` or `player_id`. | Validate fields before sending. |
| `401` | `unauthorized` | Missing or invalid API Key. | Check header `Authorization: Bearer {key}`. |
| `402` | `insufficient_balance` | Reseller wallet has insufficient funds. | Top up balance via ABA PayWay / KHQR / USDT. |
| `404` | `not_found` | Game slug, package ID, or order code does not exist. | Check `/api/v1/games` package catalogue. |
| `409` | `conflict` | The `reference` ID was used for a different payload. | Generate unique references per unique purchase. |
| `429` | `rate_limited` | Exceeded 120 calls/min or 60 orders/min. | Read `Retry-After` header and back off. |
| `500` | `internal_server_error`| Upstream provider temporary issue. | Retry with same `reference` after 5 seconds. |

---

## 9. Reseller Wallet Funding & Support

To start placing orders in production:
1. Log in to your account at [https://khmer-topup.com](https://khmer-topup.com).
2. Go to **Wallet / Reseller Settings** and generate your secret API Key.
3. Deposit funds instantly using **ABA PayWay (KHQR)** or **USDT / Binance Pay**.
4. Telegram Support Bot: [@khmertopup](https://t.me/khmertopup)
