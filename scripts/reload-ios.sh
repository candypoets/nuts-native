#!/bin/bash
# Quick restart the iOS app to pick up dev server changes
# Usage: ./scripts/reload-ios.sh

set -e

BUNDLE_ID="com.nutscash.sparkling"

echo "Terminating app..."
xcrun simctl terminate booted "$BUNDLE_ID" 2>/dev/null || true
sleep 0.5

echo "Launching app..."
xcrun simctl launch booted "$BUNDLE_ID"
echo "Done! App reloaded."
