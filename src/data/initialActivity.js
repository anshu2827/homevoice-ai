const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60_000).toISOString();

export const initialActivity = [
  {
    id: 'seed-1',
    title: 'Living Room AC adjusted',
    detail: 'Cooling set to 22° · Living Room',
    timestamp: minutesAgo(8),
    kind: 'climate',
  },
  {
    id: 'seed-2',
    title: 'Kitchen Smart Plug is on',
    detail: 'Coffee maker · Kitchen',
    timestamp: minutesAgo(37),
    kind: 'plug',
  },
  {
    id: 'seed-3',
    title: 'Bedroom Light dimmed',
    detail: 'Brightness set to 74% · Bedroom',
    timestamp: minutesAgo(96),
    kind: 'light',
  },
  {
    id: 'seed-4',
    title: 'Home is in good rhythm',
    detail: 'All simulated systems checked in',
    timestamp: minutesAgo(240),
    kind: 'home',
  },
];
