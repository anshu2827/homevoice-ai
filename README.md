# HOMEVOICE AI

A Pinterest-inspired smart-home dashboard foundation built with React, Vite, JavaScript, and Tailwind CSS. Device controls, voice examples, energy figures, room readings, and automations are simulated locally; this project does not connect to physical hardware or a Home Assistant server.

## Run locally

```bash
pnpm install
pnpm dev
```

The development server listens on `http://localhost:3000`. Create a production build with `pnpm build`; preview that build with `pnpm preview`.

## Project structure

```text
src/
  components/  Shared shell, navigation, cards, switches, status, activity, and voice preview
  data/        Initial simulated devices, rooms, and activity entries
  hooks/       Browser-local preference state
  pages/       Dashboard plus Rooms, Devices, Voice, Automations, Energy, Activity, and Settings routes
  services/    Simulated device service and persistence boundary for a future Home Assistant adapter
  state/       Shared device/activity context and toast notifications
  utils/       Command parsing and date/number formatting helpers
public/
  rooms/       Local interior photography used in the room cards
  manus-routes.json  Route manifest for the eight application pages
```

The central `DeviceProvider` exposes a shared six-device state and activity timeline. `deviceService` isolates simulated power and settings actions from UI components, and browser local storage keeps device state, activity, automation preferences, and display settings across refreshes. Typed assistant examples run through a local command parser; microphone transcription and Home Assistant access are intentionally not enabled.

## Room image references

- `public/rooms/bedroom.jpg` — The Spruce, “29 Neutral Bedroom Ideas That Aren't Bland or Boring”.
- `public/rooms/living-room.jpeg` — Coco Lapine Design, “25 sage green living room ideas for a subtle, fresh look”.
- `public/rooms/kitchen.jpg` — “31 Modern Kitchen Ideas for an Elegant and Streamlined Space”.

These are illustrative interior photos, not user properties.
