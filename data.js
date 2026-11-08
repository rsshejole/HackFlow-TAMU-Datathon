// Generated from data/HackFlow_90_Simple_Data_Clean_Header.xlsx (sheet: HackFlow 90 Records).
// Numeric values represent modeled estimates, not verified pedestrian measurements.
const EVENT_PERIODS = [
  {
    "id": "sat_hacking",
    "sheetLabel": "Sat 11:30 AM — Hacking",
    "time": "Sat · 11:30 AM",
    "title": "Hacking / regular activity"
  },
  {
    "id": "sat_lunch",
    "sheetLabel": "Sat 12:45 PM — Lunch",
    "time": "Sat · 12:45 PM",
    "title": "Lunch movement"
  },
  {
    "id": "sat_dinner",
    "sheetLabel": "Sat 6:40 PM — Dinner",
    "time": "Sat · 6:40 PM",
    "title": "Dinner movement"
  },
  {
    "id": "sat_departures",
    "sheetLabel": "Sat 11:15 PM — Departures",
    "time": "Sat · 11:15 PM",
    "title": "Overnight departures"
  },
  {
    "id": "sun_overnight",
    "sheetLabel": "Sun 2:00 AM — Overnight",
    "time": "Sun · 2:00 AM",
    "title": "Overnight hacking"
  },
  {
    "id": "sun_breakfast",
    "sheetLabel": "Sun 8:00 AM — Breakfast",
    "time": "Sun · 8:00 AM",
    "title": "Breakfast movement"
  }
];
// Compact columns: event_id, section_id, assigned_collector, estimated_crossings_per_min, estimated_congestion.
const HACKFLOW_DATA = [["sat_hacking",1,"Rohit",32,"High"],["sat_hacking",2,"Durgesh",26,"High"],["sat_hacking",3,"Durgesh",26,"High"],["sat_hacking",4,"Durgesh",12,"Moderate"],["sat_hacking",5,"Rohit",16,"Moderate"],["sat_hacking",6,"Rohit",18,"Moderate"],["sat_hacking",7,"Rohit",16,"Moderate"],["sat_hacking",8,"Aditya",12,"Moderate"],["sat_hacking",9,"Durgesh",22,"Moderate"],["sat_hacking",10,"Aditya",12,"Moderate"],["sat_hacking",11,"Aditya",14,"Moderate"],["sat_hacking",12,"Rohit",12,"Moderate"],["sat_hacking",13,"Aditya",12,"Moderate"],["sat_hacking",14,"Durgesh",36,"High"],["sat_hacking",15,"Aditya",24,"High"],["sat_lunch",1,"Rohit",44,"High"],["sat_lunch",2,"Durgesh",56,"High"],["sat_lunch",3,"Durgesh",36,"High"],["sat_lunch",4,"Durgesh",10,"Moderate"],["sat_lunch",5,"Rohit",22,"Moderate"],["sat_lunch",6,"Rohit",18,"Moderate"],["sat_lunch",7,"Rohit",14,"Moderate"],["sat_lunch",8,"Aditya",18,"Moderate"],["sat_lunch",9,"Durgesh",22,"Moderate"],["sat_lunch",10,"Aditya",14,"Moderate"],["sat_lunch",11,"Aditya",14,"Moderate"],["sat_lunch",12,"Rohit",10,"Moderate"],["sat_lunch",13,"Aditya",14,"Moderate"],["sat_lunch",14,"Durgesh",62,"High"],["sat_lunch",15,"Aditya",52,"High"],["sat_dinner",1,"Rohit",41,"High"],["sat_dinner",2,"Durgesh",54,"High"],["sat_dinner",3,"Durgesh",36,"High"],["sat_dinner",4,"Durgesh",9,"Low"],["sat_dinner",5,"Rohit",21,"Moderate"],["sat_dinner",6,"Rohit",17,"Moderate"],["sat_dinner",7,"Rohit",14,"Moderate"],["sat_dinner",8,"Aditya",16,"Moderate"],["sat_dinner",9,"Durgesh",21,"Moderate"],["sat_dinner",10,"Aditya",14,"Moderate"],["sat_dinner",11,"Aditya",14,"Moderate"],["sat_dinner",12,"Rohit",9,"Low"],["sat_dinner",13,"Aditya",13,"Moderate"],["sat_dinner",14,"Durgesh",60,"High"],["sat_dinner",15,"Aditya",52,"High"],["sat_departures",1,"Rohit",43,"High"],["sat_departures",2,"Durgesh",29,"High"],["sat_departures",3,"Durgesh",29,"High"],["sat_departures",4,"Durgesh",8,"Low"],["sat_departures",5,"Rohit",11,"Moderate"],["sat_departures",6,"Rohit",12,"Moderate"],["sat_departures",7,"Rohit",11,"Moderate"],["sat_departures",8,"Aditya",8,"Low"],["sat_departures",9,"Durgesh",15,"Moderate"],["sat_departures",10,"Aditya",8,"Low"],["sat_departures",11,"Aditya",16,"Moderate"],["sat_departures",12,"Rohit",8,"Low"],["sat_departures",13,"Aditya",8,"Low"],["sat_departures",14,"Durgesh",49,"High"],["sat_departures",15,"Aditya",32,"High"],["sun_overnight",1,"Rohit",8,"Low"],["sun_overnight",2,"Durgesh",8,"Low"],["sun_overnight",3,"Durgesh",8,"Low"],["sun_overnight",4,"Durgesh",2,"Low"],["sun_overnight",5,"Rohit",4,"Low"],["sun_overnight",6,"Rohit",10,"Moderate"],["sun_overnight",7,"Rohit",4,"Low"],["sun_overnight",8,"Aditya",2,"Low"],["sun_overnight",9,"Durgesh",12,"Moderate"],["sun_overnight",10,"Aditya",2,"Low"],["sun_overnight",11,"Aditya",4,"Low"],["sun_overnight",12,"Rohit",2,"Low"],["sun_overnight",13,"Aditya",2,"Low"],["sun_overnight",14,"Durgesh",8,"Low"],["sun_overnight",15,"Aditya",4,"Low"],["sun_breakfast",1,"Rohit",35,"High"],["sun_breakfast",2,"Durgesh",45,"High"],["sun_breakfast",3,"Durgesh",29,"High"],["sun_breakfast",4,"Durgesh",7,"Low"],["sun_breakfast",5,"Rohit",15,"Moderate"],["sun_breakfast",6,"Rohit",13,"Moderate"],["sun_breakfast",7,"Rohit",10,"Moderate"],["sun_breakfast",8,"Aditya",13,"Moderate"],["sun_breakfast",9,"Durgesh",15,"Moderate"],["sun_breakfast",10,"Aditya",10,"Moderate"],["sun_breakfast",11,"Aditya",10,"Moderate"],["sun_breakfast",12,"Rohit",7,"Low"],["sun_breakfast",13,"Aditya",10,"Moderate"],["sun_breakfast",14,"Durgesh",50,"High"],["sun_breakfast",15,"Aditya",42,"High"]];
