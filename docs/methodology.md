# Data and prediction methodology

## Scope

A single sheet with 90 records — 15 locations × six event periods. Five fields: Event period, Section, Assigned to, Estimated crossings / min, Estimated congestion. There are no alternative congestion sources in the app.

## Data provenance and limitations

An attendee provided a floor plan of the event hall and firsthand qualitative observations: aisles 1, 2, 3, 14 and the exit near 15 tend to be busy around meals; aisles 6 and 9 were comparatively busy at night although most aisles were spacious. These reports informed a modeled set of numerical counts. **The 90 numerical counts were estimated and not gathered via timed pedestrian observations.** The named members are responsible for assigned sections but the numeric entries are not verified field readings.

## Six scenarios

The Excel dataset covers Saturday hacking, lunch, dinner, departures, Sunday overnight hacking, and breakfast. Schedule timings are references; one-hour lunch, dinner and breakfast periods in the app are assumptions, not venue-specified end times.

## Estimation and routing

For the selected event period, the app reads each of 15 section estimates from a bundled JS snapshot of the one workbook. Congestion categories follow the workbook labels. Weighted Dijkstra routing minimizes layout distance or layout distance multiplied by a congestion penalty derived from the relative modeled crossings/min. No measured aisle widths, walking times, capacities or sensor feeds were provided.

## Responsible claims

The model estimates can demonstrate a working prototype but may not be described as recorded observations. Hackathon eligibility requires genuine primary data collected during the event. A judge should be shown the hall sketch and original qualitative reports and told explicitly that numerical counts are modeled until field readings are available.
