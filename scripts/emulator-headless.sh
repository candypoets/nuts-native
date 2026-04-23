#!/usr/bin/env bash
set -euo pipefail

# Headless Android Emulator launcher — minimal resources, screenshot-only workflow
# No GUI, no audio, no boot animation, no snapshot overhead

AVD_NAME="${1:-test}"

# Kill any existing emulator for this AVD
if pgrep -f "qemu-system-x86_64.*${AVD_NAME}" > /dev/null 2>&1; then
  echo "Killing existing emulator..."
  pgrep -f "qemu-system-x86_64.*${AVD_NAME}" | xargs -r kill -9
  sleep 2
fi

echo "Starting headless emulator (AVD: ${AVD_NAME})..."
echo "  Mode:   headless (no window, no X11 required)"
echo "  GPU:    swiftshader_indirect"
echo "  Audio:  off"
echo "  Boot:   cold (no snapshot I/O)"
echo ""

/opt/android-sdk/emulator/emulator -avd "${AVD_NAME}" \
  -no-window \
  -no-boot-anim \
  -no-audio \
  -no-snapshot \
  -gpu swiftshader_indirect \
  > /tmp/emulator-headless.log 2>&1 &

EMULATOR_PID=$!
echo "Emulator PID: ${EMULATOR_PID}"
echo "Logs: tail -f /tmp/emulator-headless.log"
echo ""
echo "Waiting for device to boot..."

until adb devices | grep -q "emulator"; do
  sleep 1
done

adb wait-for-device
while [ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" != "1" ]; do
  sleep 2
done

echo ""
echo "✅ Headless emulator ready"
echo ""
echo "Screenshot (fastest):"
echo "  adb shell screencap -p /sdcard/screen.png && adb pull /sdcard/screen.png"
echo ""
echo "Memory check:"
echo "  ps -o pid,vsz,rss,comm -p ${EMULATOR_PID}"
echo ""
echo "Kill:"
echo "  kill ${EMULATOR_PID}"
