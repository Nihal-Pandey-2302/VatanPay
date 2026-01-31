#!/bin/bash

# VatanPay Contract Deployment Script
# Deploys the contract to Stellar Testnet

set -e

echo "🚀 Building VatanPay contract..."
cd "$(dirname "$0")/../contract"
cargo build --target wasm32-unknown-unknown --release

echo "✅ Contract built successfully!"
echo ""

# Check if Stellar CLI is configured
if ! stellar keys ls | grep -q "vatanpay-admin"; then
    echo "⚙️  Creating admin identity..."
    stellar keys generate vatanpay-admin --network testnet
fi

echo "📝 Admin address:"
ADMIN_ADDRESS=$(stellar keys address vatanpay-admin)
echo "$ADMIN_ADDRESS"
echo ""

echo "💰 Funding admin account on testnet..."
curl "https://friendbot.stellar.org?addr=$ADMIN_ADDRESS" > /dev/null 2>&1 || true
sleep 2

echo "🔧 Deploying contract to testnet..."
CONTRACT_ID=$(soroban contract deploy \
    --wasm target/wasm32-unknown-unknown/release/vatanpay_contract.wasm \
    --source vatanpay-admin \
    --network testnet)

echo "✅ Contract deployed!"
echo "📋 Contract ID: $CONTRACT_ID"
echo ""

echo "🎬 Initializing contract..."
soroban contract invoke \
    --id "$CONTRACT_ID" \
    --source vatanpay-admin \
    --network testnet \
    -- \
    initialize \
    --admin "$ADMIN_ADDRESS"

echo "✅ Contract initialized!"
echo ""

# Save contract ID to .env file
cd ..
echo "VITE_CONTRACT_ID=$CONTRACT_ID" > frontend/.env
echo "CONTRACT_ID=$CONTRACT_ID" >> frontend/.env
echo "ADMIN_ADDRESS=$ADMIN_ADDRESS" >> frontend/.env

echo "💾 Contract ID saved to frontend/.env"
echo ""
echo "🎉 Deployment complete!"
echo "Contract ID: $CONTRACT_ID"
echo "Network: Testnet"
echo "Explorer: https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
