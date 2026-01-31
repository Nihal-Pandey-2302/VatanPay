#!/bin/bash

echo "💧 VatanPay DEX Liquidity Setup"
echo "================================"
echo ""

# Load configuration from parent directory
CONFIG_FILE="../testnet-config.json"
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ testnet-config.json not found. Run ./setup-testnet.sh first"
    exit 1
fi

# Extract keys from config
AED_ISSUER=$(jq -r '.aed_issuer' $CONFIG_FILE)
INR_ISSUER=$(jq -r '.inr_issuer' $CONFIG_FILE)
DISTRIBUTOR=$(jq -r '.distributor' $CONFIG_FILE)

# Get secrets from Stellar CLI
echo "🔑 Retrieving secrets from Stellar CLI..."
AED_ISSUER_SECRET=$(stellar keys secret aed-issuer)
INR_ISSUER_SECRET=$(stellar keys secret inr-issuer)
DISTRIBUTOR_SECRET=$(stellar keys secret distributor)

echo "📋 Configuration:"
echo "   AED Issuer: $AED_ISSUER"
echo "   INR Issuer: $INR_ISSUER"
echo "   Distributor: $DISTRIBUTOR"
echo ""

# Create Node.js script for liquidity setup
cat > setup-liquidity.js << 'EOF'
const StellarSdk = require('stellar-sdk');
const fs = require('fs');

const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');

async function setupLiquidity() {
    try {
        // Get credentials from environment
        const aedIssuerPubkey = process.env.AED_ISSUER;
        const inrIssuerPubkey = process.env.INR_ISSUER;
        const distributorPubkey = process.env.DISTRIBUTOR;
        const aedIssuerSecret = process.env.AED_ISSUER_SECRET;
        const inrIssuerSecret = process.env.INR_ISSUER_SECRET;
        const distributorSecret = process.env.DISTRIBUTOR_SECRET;
        
        console.log('🔑 Loading distributor account...');
        const distributorAccount = await server.loadAccount(distributorPubkey);
        
        // Define assets
        const AED = new StellarSdk.Asset('AED', aedIssuerPubkey);
        const INR = new StellarSdk.Asset('INR', inrIssuerPubkey);
        const XLM = StellarSdk.Asset.native();
        
        console.log('');
        console.log('📝 Step 1: Creating trustlines...');
        
        // Build trustline transaction
        let trustlineTx = new StellarSdk.TransactionBuilder(distributorAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
        })
        .addOperation(StellarSdk.Operation.changeTrust({
            asset: AED,
            limit: '1000000000', // 1B AED - Increase limit to avoid op_line_full
        }))
        .addOperation(StellarSdk.Operation.changeTrust({
            asset: INR,
            limit: '1000000000', // 1B INR
        }))
        .setTimeout(300)
        .build();
        
        trustlineTx.sign(StellarSdk.Keypair.fromSecret(distributorSecret));
        
        console.log('   📤 Submitting trustline transaction...');
        await server.submitTransaction(trustlineTx);
        console.log('   ✅ Trustlines created!');
        
        // Wait a bit for trustlines to settle
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Helper to safely fund account
        const fundAccount = async (issuerAccount, destination, asset, amount, issuerSecret, name) => {
            try {
                let tx = new StellarSdk.TransactionBuilder(issuerAccount, {
                    fee: StellarSdk.BASE_FEE,
                    networkPassphrase: StellarSdk.Networks.TESTNET,
                })
                .addOperation(StellarSdk.Operation.payment({
                    destination: destination,
                    asset: asset,
                    amount: amount,
                }))
                .setTimeout(180)
                .build();
                
                tx.sign(StellarSdk.Keypair.fromSecret(issuerSecret));
                console.log(`   📤 Requesting ${name} tokens...`);
                await server.submitTransaction(tx);
                console.log(`   ✅ Received ${amount} ${name}!`);
            } catch (e) {
                // If error is op_line_full, we probably have enough tokens
                const codes = e.response?.data?.extras?.result_codes?.operations || [];
                if (codes.includes('op_line_full')) {
                    console.log(`   ⚠️  Account already full of ${name} (op_line_full). Proceeding...`);
                } else {
                    console.error(`   ⚠️  Could not fund ${name}:`, e.message);
                }
            }
        };

        await fundAccount(await server.loadAccount(aedIssuerPubkey), distributorPubkey, AED, '100000', aedIssuerSecret, 'AED');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await fundAccount(await server.loadAccount(inrIssuerPubkey), distributorPubkey, INR, '5000000', inrIssuerSecret, 'INR');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('');
        console.log('📝 Step 3: Setting up bidirectional DEX liquidity...');
        
        // Reload distributor account with updated balances
        const distributorAccountUpdated = await server.loadAccount(distributorPubkey);
        
        // First, cancel any existing offers
        console.log('   🗑️  Canceling existing offers...');
        const offers = await server.offers().forAccount(distributorPubkey).call();
        
        let cancelTx = new StellarSdk.TransactionBuilder(distributorAccountUpdated, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
        });
        
        for (const offer of offers.records) {
            cancelTx = cancelTx.addOperation(StellarSdk.Operation.manageSellOffer({
                selling: offer.selling.asset_type === 'native' ? StellarSdk.Asset.native() : 
                    new StellarSdk.Asset(offer.selling.asset_code, offer.selling.asset_issuer),
                buying: offer.buying.asset_type === 'native' ? StellarSdk.Asset.native() : 
                    new StellarSdk.Asset(offer.buying.asset_code, offer.buying.asset_issuer),
                amount: '0',
                price: offer.price,
                offerId: offer.id,
            }));
        }
        
        if (offers.records.length > 0) {
            cancelTx = cancelTx.setTimeout(300).build();
            cancelTx.sign(StellarSdk.Keypair.fromSecret(distributorSecret));
            await server.submitTransaction(cancelTx);
            console.log(`   ✅  Canceled ${offers.records.length} existing offers`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Reload account after canceling offers
        const freshAccount = await server.loadAccount(distributorPubkey);
        
        // Create liquidity offers with REALISTIC conversion rates
        // Real rates: 1 XLM = ₹19.68, 1 AED = ₹25.04
        // Simplified for demo: 1 XLM = 20 INR, 1 AED = 25 INR
        console.log('   📤  Creating liquidity offers with realistic rates...');
        
        let offerTx = new StellarSdk.TransactionBuilder(freshAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET,
        })
        // XLM → AED: Distributor sells AED for XLM (enables XLM → AED swaps)
        // Rate: 1 AED = 3.0 XLM (Expensive Ask)
        .addOperation(StellarSdk.Operation.manageSellOffer({
            selling: AED,
            buying: XLM,
            amount: '25000',
            price: '3.0', 
        }))
        // XLM → INR: Distributor sells INR for XLM (enables XLM → INR swaps)
        // Rate: 1 INR = 0.05 XLM (1 XLM = 20 INR)
        .addOperation(StellarSdk.Operation.manageSellOffer({
            selling: INR,
            buying: XLM,
            amount: '1250000',
            price: '0.05', 
        }))
        // AED → XLM: Distributor sells XLM for AED (enables AED → XLM swaps)
        // Rate: 1 XLM = 0.40 AED (Cheap Bid)
        // User gives 100 AED. Max they can get?
        // 1 XLM cost 0.40 AED.
        // 100 / 0.40 = 250 XLM.
        // 250 XLM * 20 (INR/XLM) = 5000 INR.
        // Result: 100 AED -> 5000 INR. (Rate 50). A bit high (Real is 22).
        // Let's adjust to be closer to 22.
        // Target: 100 AED -> 2200 INR.
        // 2200 INR / 20 (INR per XLM) = 110 XLM.
        // We need 100 AED to buy 110 XLM.
        // 110 XLM * Price = 100 AED.
        // Price = 100 / 110 = 0.9 AED/XLM.
        // Let's use Price = 0.9.
        .addOperation(StellarSdk.Operation.manageSellOffer({
            selling: XLM,
            buying: AED,
            amount: '5000',
            price: '0.9',   
        }))
        .setTimeout(180) // Reduced timeout to fail faster if issues
        .build();
        
        console.log('   📤 Submitting offer transaction...');
        offerTx.sign(StellarSdk.Keypair.fromSecret(distributorSecret));
        const gridResult = await server.submitTransaction(offerTx);
        console.log('   ✅ Liquidity offers created! TX Hash:', gridResult.hash);
        console.log('   ✅ Offers verified via submission.');
        
        // Check if offers exist
        console.log('   🔍 Verifying Order Book...');
        
        // Check XLM -> AED (selling AED for XLM)
        const checkAedBook = await server.orderbook(AED, XLM).call();
        // Check XLM -> INR (selling INR for XLM)
        const checkInrBook = await server.orderbook(INR, XLM).call();
        
        // We added:
        // 1. Sell AED for XLM (buying XLM with AED) -> waits, selling XLM for AED
        // The operation was: manageSellOffer(selling: XLM, buying: AED)
        // This appears on the orderbook as: Selling XLM (Native), Buying AED
        const checkXlmAedBook = await server.orderbook(XLM, AED).call();

        if (checkXlmAedBook.asks.length > 0) {
             console.log('   ✅ XLM -> AED Liquidity Confirmed (Ask present)');
        } else {
             console.log('   ⚠️ XLM -> AED Liquidity NOT found (No asks)');
        }
        
    } catch (error) {
        console.error('❌ Error setting up liquidity:', error);
        // Continue if it's just an "op_line_full" error from before? 
        // No, we want to see the error.
        if (error.response?.data) {
            console.error('Details:', JSON.stringify(error.response.data, null, 2));
        }
        process.exit(1);
    }
}

setupLiquidity();
EOF

echo "🚀 Running liquidity setup..."
echo ""

# Use frontend's node_modules
export NODE_PATH="../frontend/node_modules"

# Export environment variables for Node.js script
export AED_ISSUER
export INR_ISSUER  
export DISTRIBUTOR
export AED_ISSUER_SECRET
export INR_ISSUER_SECRET
export DISTRIBUTOR_SECRET

node setup-liquidity.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Liquidity setup successful!"
    echo ""
    echo "🧪 Test your faucet now!"
    echo "   The DEX should have liquidity for XLM → AED and XLM → INR swaps"
    rm -f setup-liquidity.js
else
    echo ""
    echo "❌ Liquidity setup failed. Check errors above."
    exit 1
fi
