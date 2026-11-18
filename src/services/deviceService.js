import { initialDevices } from '../data/initialDevices.js';

const DEVICE_STORAGE_KEY = 'homevoice.devices.v1';

function readJson(key) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export const deviceService = {
  mode: 'simulated',

  loadDevices() {
    const saved = readJson(DEVICE_STORAGE_KEY);
    return Array.isArray(saved) && saved.length
      ? saved
      : initialDevices.map((device) => ({ ...device, settings: { ...device.settings } }));
  },

  persistDevices(devices) {
    try {
      window.localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(devices));
    } catch {
      // The UI remains usable if browser storage is unavailable.
    }
  },

  setPower(devices, deviceId, isOn) {
    const changedDevice = devices.find((device) => device.id === deviceId);
    if (!changedDevice || changedDevice.isOn === isOn) {
      return { devices, changedDevice: null };
    }

    return {
      devices: devices.map((device) =>
        device.id === deviceId ? { ...device, isOn } : device,
      ),
      changedDevice: { ...changedDevice, isOn },
    };
  },

  updateSettings(devices, deviceId, patch) {
    let changedDevice = null;
    const nextDevices = devices.map((device) => {
      if (device.id !== deviceId) return device;
      const settings = { ...device.settings, ...patch };
      if (Object.keys(patch).every((key) => Object.is(device.settings[key], patch[key]))) {
        return device;
      }
      changedDevice = { ...device, settings };
      return changedDevice;
    });
    return { devices: nextDevices, changedDevice };
  },
};

// Future Home Assistant adapters can implement loadDevices, setPower and updateSettings
// without coupling API credentials, transport, or hardware claims to React components.
