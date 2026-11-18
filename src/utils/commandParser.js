const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function parseSimulatedCommand(rawCommand, devices) {
  const command = rawCommand.trim().toLowerCase().replace(/[.!?]+$/g, '');
  if (!command) return { type: 'unknown', message: 'Try a command like “turn off the living room light”.' };

  const brightnessMatch = command.match(/(?:brightness|light)\s+(?:to\s+)?(\d{1,3})\s*%?/);
  if (brightnessMatch) {
    const target = devices.find((device) =>
      device.category === 'light' && command.includes(device.name.toLowerCase()),
    );
    if (target) {
      return {
        type: 'setting',
        deviceIds: [target.id],
        setting: 'brightness',
        value: clamp(Number(brightnessMatch[1]), 1, 100),
        message: `${target.name} brightness set to ${clamp(Number(brightnessMatch[1]), 1, 100)}%.`,
      };
    }
  }

  const temperatureMatch = command.match(/(?:temperature|temp|ac)\s+(?:to\s+)?(\d{1,2})\s*(?:°|degrees?)?/);
  if (temperatureMatch) {
    const target = devices.find((device) =>
      device.category === 'climate' && command.includes(device.name.toLowerCase()),
    );
    if (target) {
      const value = clamp(Number(temperatureMatch[1]), 16, 30);
      return {
        type: 'setting',
        deviceIds: [target.id],
        setting: 'temperature',
        value,
        message: `${target.name} temperature set to ${value}°.`,
      };
    }
  }

  const isOn = /\b(turn on|switch on|power on|enable)\b/.test(command);
  const isOff = /\b(turn off|switch off|power off|disable)\b/.test(command);
  if (!isOn && !isOff) {
    return { type: 'unknown', message: 'Try “turn on Bedroom Light” or “set Living Room AC temperature to 21”.' };
  }

  let matches;
  if (/\ball\s+lights\b/.test(command) || command.includes('all the lights')) {
    matches = devices.filter((device) => device.category === 'light');
  } else {
    matches = devices.filter((device) => command.includes(device.name.toLowerCase()));
  }

  if (!matches.length) {
    return { type: 'unknown', message: 'I couldn’t match that to a demo device. Try its full name, such as “Bedroom Fan”.' };
  }

  const action = isOn ? 'on' : 'off';
  return {
    type: 'power',
    deviceIds: matches.map((device) => device.id),
    isOn,
    message: `${matches.map((device) => device.name).join(' and ')} turned ${action} in the simulation.`,
  };
}
