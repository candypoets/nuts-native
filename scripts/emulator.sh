#!/usr/bin/env bash
set -euo pipefail

# Optimized Android Emulator launcher for nuts-native
# Uses SwiftShader GPU (software rendering that's actually optimized)
# Reduced RAM/heap to prevent OOM crashes on the build host

AVD_NAME="${1:-test}"
DISPLAY_NUM="${DISPLAY:-:99}"

# Kill any existing emulator for this AVD to avoid conflicts
if pgrep -f "emulator.*-avd ${AVD_NAME}" > /dev/null 2>&1; then
  echo "Killing existing emulator for AVD '${AVD_NAME}'..."
  pkill -f "emulator.*-avd ${AVD_NAME}" || true
  sleep 2
fi

echo "Starting emulator (AVD: ${AVD_NAME}) with optimized settings..."
echo "  GPU:    swiftshader_indirect (optimized software rendering)"
echo "  RAM:    768 MB"
echo "  Cores:  2"
echo "  Heap:   128 MB"
echo "  Display: ${DISPLAY_NUM}"
echo ""

export DISPLAY="${DISPLAY_NUM}"

# Launch lean: no boot animation, no audio, optimized GPU
/opt/android-sdk/emulator/emulator -avd "${AVD_NAME}" \
  -no-boot-anim \
  -no-audio \
  -gpu swiftshader_indirect \
  &

EMULATOR_PID=$!
echo "Emulator PID: ${EMULATOR_PID}"
echo ""
echo "Waiting for device to boot (this may take 30-60s)..."

# Wait for adb to see the device
until adb devices | grep -q "emulator"; do
  sleep 1
done

# Wait for boot to complete
adb wait-for-device
while [ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" != "1" ]; do
  sleep 2
done

echo ""
echo "✅ Emulator is ready!"
echo ""
echo "Quick commands:"
echo "  Screenshot:  adb shell screencap -p /sdcard/screen.png && adb pull /sdcard/screen.png"
echo "  Install APK: adb install path/to/app.apk"
echo "  Logcat:      adb logcat"
echo "  Kill:        pkill -f \"emulator.*-avd ${AVD_NAME}\""
