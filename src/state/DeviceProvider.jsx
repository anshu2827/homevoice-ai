import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { initialActivity } from '../data/initialActivity.js';
import { deviceService } from '../services/deviceService.js';

const DeviceContext = createContext(null);
const ACTIVITY_STORAGE_KEY = 'homevoice.activity.v1';

function loadActivity() {
  try {
    const saved = window.localStorage.getItem(ACTIVITY_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    return Array.isArray(parsed) ? parsed : initialActivity;
  } catch {
    return initialActivity;
  }
}

export function DeviceProvider({ children }) {
  const [devices, setDevices] = useState(() => deviceService.loadDevices());
  const [activity, setActivity] = useState(loadActivity);
  const settingTimers = useRef(new Map());

  useEffect(() => deviceService.persistDevices(devices), [devices]);
  useEffect(() => {
    try {
      window.localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activity.slice(0, 40)));
    } catch {
      // Activity is convenient history, not a dependency for control behavior.
    }
  }, [activity]);

  const recordActivity = useCallback((title, detail, kind = 'home') => {
    const event = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      title,
      detail,
      timestamp: new Date().toISOString(),
      kind,
    };
    setActivity((current) => [event, ...current].slice(0, 40));
  }, []);

  const setDevicesPower = useCallback((deviceIds, isOn) => {
    let nextDevices = devices;
    const changedDevices = [];

    deviceIds.forEach((deviceId) => {
      const result = deviceService.setPower(nextDevices, deviceId, isOn);
      if (!result.changedDevice) return;
      nextDevices = result.devices;
      changedDevices.push(result.changedDevice);
    });

    if (!changedDevices.length) return 0;
    setDevices(nextDevices);
    changedDevices.forEach((device) => {
      recordActivity(
        `${device.name} turned ${isOn ? 'on' : 'off'}`,
        `${device.room} · simulated control`,
        device.category,
      );
    });
    return changedDevices.length;
  }, [devices, recordActivity]);

  const setDevicePower = useCallback((deviceId, isOn) => (
    setDevicesPower([deviceId], isOn) > 0
  ), [setDevicesPower]);

  const toggleDevice = useCallback((deviceId) => {
    const device = devices.find((item) => item.id === deviceId);
    return device ? setDevicePower(deviceId, !device.isOn) : false;
  }, [devices, setDevicePower]);

  const updateDeviceSettings = useCallback((deviceId, patch) => {
    const currentDevice = devices.find((device) => device.id === deviceId);
    const result = deviceService.updateSettings(devices, deviceId, patch);
    if (!result.changedDevice || !currentDevice) return false;
    setDevices(result.devices);

    const [key, value] = Object.entries(patch)[0] || [];
    const settingDetail = {
      brightness: `Brightness set to ${value}%`,
      colorTemperature: `Color temperature set to ${value} K`,
      temperature: `Temperature set to ${value}°`,
      speed: `Fan speed set to ${value}`,
      fanSpeed: `Fan speed set to ${value}`,
      oscillating: `Oscillation ${value ? 'on' : 'off'}`,
    }[key] || 'Device setting updated';
    const timerKey = `${deviceId}:${key}`;
    const previousTimer = settingTimers.current.get(timerKey);
    if (previousTimer) window.clearTimeout(previousTimer);
    const timer = window.setTimeout(() => {
      recordActivity(`${currentDevice.name} adjusted`, `${currentDevice.room} · ${settingDetail}`, currentDevice.category);
      settingTimers.current.delete(timerKey);
    }, 500);
    settingTimers.current.set(timerKey, timer);
    return true;
  }, [devices, recordActivity]);

  const resetDemo = useCallback(() => {
    settingTimers.current.forEach((timer) => window.clearTimeout(timer));
    settingTimers.current.clear();
    try {
      window.localStorage.removeItem('homevoice.devices.v1');
      window.localStorage.removeItem(ACTIVITY_STORAGE_KEY);
    } catch {
      // The in-memory demo can still reset when storage is unavailable.
    }
    setDevices(deviceService.loadDevices());
    setActivity(initialActivity);
  }, []);

  const value = useMemo(() => ({
    devices,
    activity,
    mode: deviceService.mode,
    setDevicePower,
    setDevicesPower,
    toggleDevice,
    updateDeviceSettings,
    recordActivity,
    resetDemo,
  }), [devices, activity, setDevicePower, setDevicesPower, toggleDevice, updateDeviceSettings, recordActivity, resetDemo]);

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
}

export function useDevices() {
  const context = useContext(DeviceContext);
  if (!context) throw new Error('useDevices must be used within DeviceProvider');
  return context;
}
