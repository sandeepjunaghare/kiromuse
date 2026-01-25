# x402 E-Commerce Implementation Guide
## Comprehensive Research & Coding Agent Instructions

---

## Table of Contents
1. [Overview & Architecture](#1-overview--architecture)
2. [Primary Documentation Sources](#2-primary-documentation-sources)
3. [SDK & Package Reference](#3-sdk--package-reference)
4. [Implementation Patterns](#4-implementation-patterns)
5. [Frontend Integration](#5-frontend-integration)
6. [Backend Implementation](#6-backend-implementation)
7. [Advanced Features](#7-advanced-features)
8. [E-Commerce Specific Considerations](#8-e-commerce-specific-considerations)
9. [Testing & Deployment](#9-testing--deployment)
10. [Code Examples Repository](#10-code-examples-repository)

---

## 1. Overview & Architecture

### What is x402?
x402 is an open HTTP-based payment protocol that uses the `HTTP 402 Payment Required` status code to enable instant stablecoin micropayments. It eliminates the need for accounts, API keys, or subscriptions.

### Core Flow
```
1. Client requests resource
2. Server returns 402 + payment requirements (amount, wallet, network)
3. Client signs payment authorization (EIP-712/EIP-3009)
4. Client retries request with X-PAYMENT header
5. Server verifies via facilitator
6. Facilitator settles on-chain (~2 seconds)
7. Server delivers resource + payment receipt
```

### Key Components
- **Resource Server**: Your API/storefront that requires payment
- **Facilitator**: Handles verification & on-chain settlement (Coinbase CDP provides free facilitator)
- **Client**: User's wallet/browser that signs payments
- **Bazaar**: Discovery layer for AI agents to find services

### Supported Networks
| Network | Chain ID (CAIP-2) | Asset |
|---------|-------------------|-------|
| Base Sepolia (testnet) | `eip155:84532` | USDC |
| Base Mainnet | `eip155:8453` | USDC |
| Solana Devnet | `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1` | USDC |
| Solana Mainnet | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | USDC |

---

## 2. Primary Documentation Sources

### Official Documentation (MUST READ)
| Resource | URL | Purpose |
|----------|-----|---------|
| **x402 GitBook Docs** | https://x402.gitbook.io/x402 | Canonical protocol documentation |
| **Coinbase CDP x402 Docs** | https://docs.cdp.coinbase.com/x402/welcome | Facilitator integration |
| **GitHub Repository** | https://github.com/coinbase/x402 | Reference implementations, specs, examples |
| **x402 Whitepaper** | https://www.x402.org/x402-whitepaper.pdf | Deep technical specification |
| **Protocol Specs** | https://github.com/coinbase/x402/tree/main/specs | Formal protocol specifications |

### Quickstart Guides
| Guide | URL |
|-------|-----|
| Seller Quickstart | https://x402.gitbook.io/x402/getting-started/quickstart-for-sellers |
| Buyer Quickstart | https://x402.gitbook.io/x402/getting-started/quickstart-for-buyers |
| Bazaar Discovery | https://x402.gitbook.io/x402/core-concepts/bazaar-discovery-layer |
| MCP Server Integration | https://x402.gitbook.io/x402/guides/mcp-server-with-x402 |
| V1 to V2 Migration | https://x402.gitbook.io/x402/guides/migration-guide-v1-to-v2 |

### Tutorial Resources
| Tutorial | URL | Description |
|----------|-----|-------------|
| QuickNode Paywall Guide | https://www.quicknode.com/guides/infrastructure/how-to-use-x402-payment-required | Video paywall implementation |
| Next.js API Monetization | https://koha.hashnode.dev/how-to-monetise-your-api-in-nextjs-using-the-x402-protocol | Complete Next.js walkthrough |
| Sahara AI Deep Dive | https://saharaai.com/blog/understanding-x402 | Architectural breakdown |

### V2 Features & Roadmap
| Resource | URL |
|----------|-----|
| V2 Launch Announcement | https://www.x402.org/writing/x402-v2-launch |
| Cloudflare x402 Foundation | https://blog.cloudflare.com/x402/ |
| Ecosystem Projects | https://www.x402.org/ecosystem |

---

## 3. SDK & Package Reference

### Official NPM Packages
```bash
# Full installation (all packages)
npm install @x402/core @x402/evm @x402/svm @x402/axios @x402/fetch \
            @x402/express @x402/hono @x402/next @x402/paywall @x402/extensions

# Minimal client (fetch-based)
npm install @x402/core @x402/evm @x402/fetch

# Minimal server (Express)
npm install @x402/core @x402/evm @x402/express

# Next.js middleware
npm install @x402/core @x402/evm @x402/next
```

### Package Purposes
| Package | Purpose |
|---------|---------|
| `@x402/core` | Core protocol types, HTTP client/server utilities |
| `@x402/evm` | EVM chain support (Base, Ethereum) |
| `@x402/svm` | Solana support |
| `@x402/fetch` | Fetch wrapper with automatic payment handling |
| `@x402/axios` | Axios interceptor with payment handling |
| `@x402/express` | Express.js middleware |
| `@x402/hono` | Hono framework middleware |
| `@x402/next` | Next.js middleware |
| `@x402/paywall` | Modular paywall components (V2) |
| `@x402/extensions` | Bazaar discovery, authentication extensions |

### Third-Party Packages
| Package | NPM | Purpose |
|---------|-----|---------|
| thirdweb x402 | `thirdweb` | ERC-20 token support, React hooks |
| x402-solana | `x402-solana` | Solana-specific client/server |
| @payai/x402-solana-react | `@payai/x402-solana-react` | React paywall components for Solana |
| xtended402 | https://github.com/mvpoyatt/xtended402 | Go/React e-commerce extensions |

### Go SDK
```bash
go get github.com/coinbase/x402/go
```

### Python SDK
```bash
pip install x402  # Note: V2 support in development
```

---

## 4. Implementation Patterns

### Pattern 1: Simple API Paywall (Express)
```typescript
import express from "express";
import { paymentMiddleware } from "@x402/express";
import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
import { registerExactEvmScheme } from "@x402/evm/exact/server";

const app = express();
const payTo = "0xYourWalletAddress";

const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://x402.org/facilitator"  // Testnet
  // Production: "https://api.cdp.coinbase.com/platform/v2/x402"
});

const server = new x402ResourceServer(facilitatorClient);
registerExactEvmScheme(server);

app.use(
  paymentMiddleware(
    {
      "GET /api/product/:id": {
        accepts: [{
          scheme: "exact",
          price: "$0.99",
          network: "eip155:84532",  // Base Sepolia
          payTo,
        }],
        description: "Product details",
        mimeType: "application/json",
      },
    },
    server,
  ),
);
```

### Pattern 2: Dynamic Pricing (E-Commerce Cart)
```typescript
// Using xtended402 pattern for cart-based pricing
import { paymentMiddleware } from "@x402/express";

// Calculate price from cart in preceding middleware
app.use("/checkout", (req, res, next) => {
  const cart = req.body.items;
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  req.x402Price = total.toFixed(2);  // Store computed price
  next();
});

app.use(
  paymentMiddleware(
    {
      "POST /checkout": {
        accepts: [{
          scheme: "exact",
          price: (req) => `$${req.x402Price}`,  // Dynamic price
          network: "eip155:8453",
          payTo: "0xMerchantWallet",
        }],
        description: "Complete purchase",
      },
    },
    server,
  ),
);
```

### Pattern 3: Next.js Middleware
```typescript
// middleware.ts
import { paymentMiddleware } from "@x402/next";

const facilitatorObj = { 
  url: "https://x402.org/facilitator" as `https://${string}` 
};

export const middleware = paymentMiddleware(
  "0xYourWalletAddress",
  {
    '/api/premium': {
      price: '$0.10',
      network: "base-sepolia",
      config: { description: 'Premium content access' }
    },
  },
  facilitatorObj
);

export const config = {
  matcher: ['/api/:path*'],
  runtime: "nodejs"
};
```

### Pattern 4: Multi-Merchant / Marketplace
```typescript
// V2 supports dynamic payTo routing
app.use(
  paymentMiddleware({
    "POST /marketplace/purchase": {
      accepts: [{
        scheme: "exact",
        price: (req) => `$${req.body.price}`,
        network: "eip155:8453",
        // Dynamic routing to vendor wallet
        payTo: (req) => getVendorWallet(req.body.vendorId),
      }],
    },
  }, server),
);
```

---

## 5. Frontend Integration

### Pattern A: React with MetaMask (viem)
```typescript
// app/page.tsx
"use client";
import { useState } from "react";
import { wrapFetchWithPayment } from "@x402/fetch";
import { x402Client } from "@x402/core/client";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { createWalletClient, custom } from "viem";
import { baseSepolia } from "viem/chains";

export default function Checkout() {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    
    // Connect wallet
    const walletClient = createWalletClient({
      chain: baseSepolia,
      transport: custom(window.ethereum),
    });
    const [address] = await walletClient.requestAddresses();
    
    // Create x402 client
    const client = new x402Client();
    registerExactEvmScheme(client, { 
      signer: { address, signTypedData: walletClient.signTypedData }
    });
    
    // Wrap fetch with payment handling
    const fetchWithPayment = wrapFetchWithPayment(fetch, client);
    
    // Make paid request
    const response = await fetchWithPayment("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ items: cartItems }),
    });
    
    if (response.ok) {
      const result = await response.json();
      // Handle success - show order confirmation
    }
    
    setLoading(false);
  };

  return (
    <button onClick={handlePurchase} disabled={loading}>
      {loading ? "Processing..." : "Pay with USDC"}
    </button>
  );
}
```

### Pattern B: Solana Wallet Integration
```typescript
import { X402Paywall } from '@payai/x402-solana-react';
import '@payai/x402-solana-react/styles';

function ProductPage({ product }) {
  return (
    <X402Paywall
      amount={product.price}
      description={product.name}
      network="solana"
      autoSetupProviders={true}  // Auto-configures Phantom, Solflare
    >
      <PremiumContent product={product} />
    </X402Paywall>
  );
}
```

### Pattern C: thirdweb React Hook
```typescript
import { useFetchWithPayment } from "thirdweb/x402";

function CheckoutButton() {
  const { fetchWithPayment, isLoading } = useFetchWithPayment();

  const handlePurchase = async () => {
    const response = await fetchWithPayment("/api/purchase");
    // Handles wallet connection, funding UI, and errors automatically
  };

  return <button onClick={handlePurchase}>Buy Now</button>;
}
```

### Pattern D: Coinbase Embedded Wallets (No Extension Required)
```typescript
// See: https://docs.cdp.coinbase.com/embedded-wallets/onramp-integration
// Users can create wallets with just email, fund via Coinbase Onramp
```

---

## 6. Backend Implementation

### Express Server with Full Features
```typescript
import express from "express";
import { paymentMiddleware } from "@x402/express";
import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
import { registerExactEvmScheme } from "@x402/evm/exact/server";
import { withBazaar } from "@x402/extensions/bazaar";

const app = express();
app.use(express.json());

const payTo = process.env.MERCHANT_WALLET!;

// Create facilitator with Bazaar discovery
const facilitatorClient = withBazaar(
  new HTTPFacilitatorClient({
    url: process.env.NODE_ENV === "production"
      ? "https://api.cdp.coinbase.com/platform/v2/x402"
      : "https://x402.org/facilitator"
  })
);

const server = new x402ResourceServer(facilitatorClient);
registerExactEvmScheme(server);

// Product catalog endpoint (free)
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Product purchase (paid)
app.use(
  paymentMiddleware(
    {
      "POST /api/purchase": {
        accepts: [
          {
            scheme: "exact",
            price: "$9.99",  // Or dynamic from request
            network: process.env.NODE_ENV === "production" 
              ? "eip155:8453"   // Base mainnet
              : "eip155:84532", // Base Sepolia
            payTo,
          },
        ],
        description: "Product purchase",
        mimeType: "application/json",
        // Enable Bazaar discovery for AI agents
        extensions: {
          bazaar: {
            discoverable: true,
            category: "ecommerce",
            tags: ["products", "digital-goods"],
          },
        },
      },
    },
    server,
  ),
);

// Handle successful payment
app.post("/api/purchase", async (req, res) => {
  const { productId, quantity } = req.body;
  
  // Payment already verified by middleware
  // Process order, update inventory, send confirmation
  const order = await createOrder(productId, quantity, req.paymentReceipt);
  
  res.json({
    success: true,
    orderId: order.id,
    txHash: req.paymentReceipt?.txHash,
  });
});

app.listen(3000);
```

### Hono Server (Cloudflare Workers Compatible)
```typescript
import { Hono } from "hono";
import { paymentMiddleware } from "@x402/hono";

const app = new Hono();

app.use(
  "/api/premium/*",
  paymentMiddleware(
    {
      "/api/premium/content": {
        accepts: [{
          scheme: "exact",
          price: "$0.25",
          network: "eip155:8453",
          payTo: "0xWallet",
        }],
      },
    },
    server,
  ),
);
```

---

## 7. Advanced Features

### Bazaar Service Discovery
```typescript
// For AI agents to discover your service
import { HTTPFacilitatorClient } from "@x402/core/http";
import { withBazaar } from "@x402/extensions/bazaar";

const facilitatorClient = withBazaar(
  new HTTPFacilitatorClient({ url: "https://x402.org/facilitator" })
);

// Query available services
const discovery = await facilitatorClient.extensions.discovery.listResources({
  type: "http",
  limit: 20,
});

// Filter by price
const affordableServices = discovery.resources.filter(item =>
  item.accepts.some(req => Number(req.maxAmountRequired) < 1000000) // < $1
);
```

### V2 Session/Subscription Patterns
```typescript
// V2 enables wallet-based identity for session access
// Sign-In-With-X (SIWx) based on CAIP-122
// Allows skipping payment for repeat access

// Route config with reusable access
{
  "GET /api/subscription-content": {
    accepts: [{
      scheme: "exact",
      price: "$5.00",
      network: "eip155:8453",
      payTo,
    }],
    // V2 extension for session-based access
    extensions: {
      session: {
        duration: 30 * 24 * 60 * 60, // 30 days in seconds
        walletAuth: true,
      },
    },
  },
}
```

### Deferred Payment Scheme (Cloudflare Proposal)
```typescript
// For batch settlements, subscriptions, or post-payment workflows
// See: https://blog.cloudflare.com/x402/

// Server can validate ID immediately but settle later
// Enables: daily batch settlements, subscription billing, licensing agreements
```

### Payment Receipts & Verification
```typescript
// Server receives payment receipt in response headers
app.post("/api/purchase", (req, res) => {
  // Access payment info from middleware
  const receipt = req.headers["x-payment-response"];
  const decoded = JSON.parse(Buffer.from(receipt, "base64").toString());
  
  // decoded contains:
  // - txHash: on-chain transaction hash
  // - networkId: chain where payment settled
  // - success: boolean
  
  // Store for order records/refunds
  await savePaymentReceipt(orderId, decoded);
});
```

---

## 8. E-Commerce Specific Considerations

### Cart & Multi-Item Purchases
```typescript
// Option 1: Single payment for entire cart
app.post("/api/checkout", async (req, res) => {
  const { items } = req.body;
  const total = calculateCartTotal(items);
  
  // Use dynamic pricing middleware (see Pattern 2)
  // x402 handles single payment for total amount
});

// Option 2: Aggregate multiple small payments (future V2 feature)
// Currently, batch into single transaction for efficiency
```

### Inventory Management
```typescript
// Important: x402 payments are final (no chargebacks)
// Verify inventory BEFORE accepting payment

app.use("/api/purchase", async (req, res, next) => {
  const { productId, quantity } = req.body;
  
  const available = await checkInventory(productId);
  if (available < quantity) {
    return res.status(400).json({ error: "Insufficient stock" });
  }
  
  // Reserve inventory before payment
  await reserveInventory(productId, quantity, req.sessionId);
  next();
});
```

### Refund Handling
```typescript
// x402 has no built-in chargebacks - implement manual refunds
async function processRefund(orderId: string) {
  const order = await getOrder(orderId);
  
  // Option 1: Send USDC back to buyer wallet
  await sendUSDC(order.buyerWallet, order.amount);
  
  // Option 2: Issue store credit (off-chain)
  await issueStoreCredit(order.buyerWallet, order.amount);
  
  await updateOrderStatus(orderId, "refunded");
}
```

### Tax Handling
```typescript
// Calculate tax before presenting price
app.use("/api/checkout", (req, res, next) => {
  const subtotal = calculateSubtotal(req.body.items);
  const tax = calculateTax(subtotal, req.body.shippingAddress);
  const total = subtotal + tax;
  
  req.x402Price = total;
  req.taxInfo = { subtotal, tax, total };
  next();
});
```

### User Wallet Onboarding
```typescript
// For users without wallets, use Coinbase Embedded Wallets + Onramp
// See: https://docs.cdp.coinbase.com/embedded-wallets/onramp-integration

// Features:
// - Email-based wallet creation (no extension)
// - Buy USDC with card via Coinbase Onramp
// - Seamless x402 payment flow
```

### Multi-Vendor Marketplaces
```typescript
// V2 supports dynamic payTo routing
const routes = {
  "POST /api/vendor/:vendorId/purchase": {
    accepts: [{
      scheme: "exact",
      price: (req) => `$${getProductPrice(req.body.productId)}`,
      network: "eip155:8453",
      payTo: (req) => getVendorWallet(req.params.vendorId),
    }],
  },
};

// Platform fee collection
// Option: Route portion to platform wallet via smart contract split
```

---

## 9. Testing & Deployment

### Testnet Setup
1. Get testnet USDC: https://faucet.circle.com (Base Sepolia)
2. Use testnet facilitator: `https://x402.org/facilitator`
3. Network: `eip155:84532` (Base Sepolia)

### Production Checklist
```
□ Switch facilitator URL to: https://api.cdp.coinbase.com/platform/v2/x402
□ Switch network to: eip155:8453 (Base mainnet)
□ Verify merchant wallet address
□ Test with small amounts first
□ Implement error handling for failed payments
□ Set up payment receipt logging
□ Configure refund workflow
□ Enable Bazaar discovery (optional, for AI agent access)
```

### Environment Variables
```bash
# .env
MERCHANT_WALLET=0xYourMainnetWallet
FACILITATOR_URL=https://api.cdp.coinbase.com/platform/v2/x402
NETWORK=eip155:8453
NODE_ENV=production
```

### Error Handling
```typescript
// Client-side
try {
  const response = await fetchWithPayment("/api/purchase", options);
  if (!response.ok) {
    if (response.status === 402) {
      // Payment required but failed
      const error = await response.json();
      showPaymentError(error.message);
    }
  }
} catch (error) {
  if (error.code === "INSUFFICIENT_FUNDS") {
    showFundingPrompt();  // Direct to Onramp
  }
}

// Server-side
app.use((err, req, res, next) => {
  if (err.code === "PAYMENT_VERIFICATION_FAILED") {
    return res.status(402).json({ 
      error: "Payment verification failed",
      details: err.message 
    });
  }
  next(err);
});
```

---

## 10. Code Examples Repository

### Official Examples
| Example | Location |
|---------|----------|
| Express Server | https://github.com/coinbase/x402/tree/main/examples/typescript/servers/express |
| Next.js Server | https://github.com/coinbase/x402/tree/main/examples/typescript/servers/next |
| Hono Server | https://github.com/coinbase/x402/tree/main/examples/typescript/servers/hono |
| Axios Client | https://github.com/coinbase/x402/tree/main/examples/typescript/clients/axios |
| Fetch Client | https://github.com/coinbase/x402/tree/main/examples/typescript/clients/fetch |
| Go Examples | https://github.com/coinbase/x402/tree/main/examples/go |
| Advanced Examples | https://github.com/coinbase/x402/tree/main/examples/typescript/servers/advanced |
| MCP Server | https://github.com/coinbase/x402/tree/main/examples/typescript/mcp |

### Community Examples
| Project | URL | Description |
|---------|-----|-------------|
| xtended402 | https://github.com/mvpoyatt/xtended402 | E-commerce extensions for Go/React |
| x402-solana | https://github.com/PayAINetwork/x402-solana | Full Solana implementation |
| QuickNode Demo | https://github.com/quiknode-labs/qn-guide-examples | Video paywall demo |

### Sample App
```bash
# Clone and run official examples
git clone https://github.com/coinbase/x402
cd x402/examples/typescript
pnpm install
pnpm build

# Run Express server
cd servers/express
cp .env.example .env
# Edit .env with your wallet address
pnpm dev

# In another terminal, run client
cd ../clients/axios
cp .env.example .env  
# Edit .env with your private key
pnpm dev
```

---

## Summary: Key Instructions for Coding Agent

### For Building an E-Commerce Platform with x402:

1. **Start with official docs**: https://x402.gitbook.io/x402 and https://github.com/coinbase/x402

2. **Use these packages**:
   - Backend: `@x402/express` or `@x402/next`
   - Frontend: `@x402/fetch` + viem for wallet connection
   - Optional: `@x402/extensions` for Bazaar discovery

3. **Key implementation files to reference**:
   - Server middleware: `github.com/coinbase/x402/typescript/packages/express`
   - Client wrapper: `github.com/coinbase/x402/typescript/packages/fetch`
   - Types: `github.com/coinbase/x402/typescript/packages/core`

4. **For dynamic cart pricing**: Use request context to compute total, pass to middleware

5. **For marketplace/multi-vendor**: Use V2 dynamic `payTo` routing

6. **For user onboarding without wallets**: Integrate Coinbase Embedded Wallets + Onramp

7. **Test on Base Sepolia first**, then deploy to Base mainnet

8. **Remember**: No chargebacks - implement your own refund logic
