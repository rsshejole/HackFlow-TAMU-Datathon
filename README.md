# HackFlow — One-Dataset Event-Aware Navigation

A static interactive indoor routing website for TAMU Datathon, built from the participant-supplied hall layout and **one Excel dataset**.

## Run locally

Open `index.html` in Chrome, Edge, or Firefox. No server, framework, database, or Internet connection is needed.

1. Choose an aisle section (1–15) and destination.
2. The website detects the current **America/Chicago** time and selects the corresponding event scenario. For judging and replay, select **Manual — replay an event**.
3. Compare the shortest schematic route and an alternative that penalizes higher estimated pedestrian crossings.
4. Click aisle circles directly on the map to change your start.

## Only congestion dataset

`data/HackFlow_90_Simple_Data_Clean_Header.xlsx` — **one sheet, 90 records, five columns**:

- `Event period` (six scenario periods)
- `Section` (15 aisle sections)
- `Assigned to` (Rohit, Durgesh, Aditya; assigned section owners)
- `Estimated crossings / min` (modeled numerical estimates)
- `Estimated congestion` (High / Moderate / Low)

The bundled `data.js` is a generated JavaScript representation of this same spreadsheet so the site can function offline via `file://`. There are no second/third source datasets and no selection of alternative data sources in the UI. **If the workbook values change, regenerate the app's bundled data before publishing those changes.**

## Six modeled event scenarios

| Scenario | Workbook label | App behavior |
|---|---|---|
| Regular activity | Sat 11:30 AM — Hacking | During Saturday general project work |
| Lunch | Sat 12:45 PM — Lunch | 12:45–1:45 PM Saturday (one-hour window assumed) |
| Dinner | Sat 6:40 PM — Dinner | 6:40–7:40 PM Saturday (one-hour window assumed) |
| Departures | Sat 11:15 PM — Departures | 11 PM Saturday–midnight Sunday |
| Overnight | Sun 2:00 AM — Overnight | Midnight–8 AM Sunday |
| Breakfast | Sun 8:00 AM — Breakfast | 8–9 AM Sunday (end assumed) |

The one-sheet workbook is the **only source of congestion values**. The official voucher gives event timing context, and the participant sketch gives physical routing geometry; neither supplies numeric congestion values.

## Forecast and limitations

The estimate for each section is looked up by event period. A Dijkstra shortest-path computation uses layout-only lengths for the direct route and increases edge costs in proportion to the workbook's modeled crossings/minute for the less-congested alternative. Values and routes are *scenario estimates*, not measured real-time occupancy or walking times. The route graph and aisle dimensions are schematic; it is not an emergency evacuation tool.

The numeric counts were modeled from qualitative reports rather than collected by timed observation. The Excel workbook and demo should not imply otherwise. The Datathon rules require original primary data gathered during the event; collect and document actual counts before claiming the numeric rows as field measurements. The hall sketch and qualitative notes were provided by an onsite participant.

## Files

- `index.html`, `styles.css`, `app.js`, `data.js` — working offline website
- `data/HackFlow_90_Simple_Data_Clean_Header.xlsx` — the only congestion dataset
- `assets/original-hall-sketch.png` — supplied layout
- `assets/official-event-schedule.png` — supplied timetable (timing reference only)
- `docs/methodology.md` — collection and modeling methods, limitations
- `docs/demo_video_script.md` — 2-minute demo script

## Team

Rohit: sections 1, 5, 6, 7, 12 · Durgesh: 2, 3, 4, 9, 14 · Aditya: 8, 10, 11, 13, 15.

## Publish

Create a GitHub repository, upload the files in this folder, enable GitHub Pages, and provide the repo link and a ~2-minute demo video in Devpost. No submission has been made automatically.
