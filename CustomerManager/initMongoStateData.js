//use custmgr
db = db.getSiblingDB('custmgr')
var states = [
  { "name":"Alabama", "abbreviation":"AL"},
  { "name":" Montana", "abbreviation":"MT"},
  { "name":" Alaska", "abbreviation":"AK"},
  { "name":" Nebraska", "abbreviation":"NE"},
  { "name":" Arizona", "abbreviation":"AZ"},
  { "name":" Nevada", "abbreviation":"NV"},
  { "name":"Arkansas", "abbreviation":"AR"},
  { "name":" New Hampshire", "abbreviation":"NH"},
  { "name":"California", "abbreviation":"CA"},
  { "name":"New Jersey", "abbreviation":"NJ"},
  { "name":"Colorado", "abbreviation":"CO"},
  { "name":"New Mexico", "abbreviation":"NM"},
  { "name":"Connecticut", "abbreviation":"CT"},
  { "name":"New York", "abbreviation":"NY"},
  { "name":"Delaware", "abbreviation":"DE"},
  { "name":"North Carolina", "abbreviation":"NC"},
  { "name":"Florida", "abbreviation":"FL"},
  { "name":"North Dakota", "abbreviation":"ND"},
  { "name":"Georgia", "abbreviation":"GA"},
  { "name":"Ohio", "abbreviation":"OH"},
  { "name":"Hawaii", "abbreviation":"HI"},
  { "name":"Oklahoma", "abbreviation":"OK"},
  { "name":"Idaho", "abbreviation":"ID"},
  { "name":"Oregon", "abbreviation":"OR"},
  { "name":"Illinois", "abbreviation":"IL"},
  { "name":"Pennsylvania", "abbreviation":"PA"},
  { "name":"Indiana", "abbreviation":"IN"},
  { "name":" Rhode Island", "abbreviation":"RI"},
  { "name":"Iowa", "abbreviation":"IA"},
  { "name":"South Carolina", "abbreviation":"SC"},
  { "name":"Kansas", "abbreviation":"KS"},
  { "name":"South Dakota", "abbreviation":"SD"},
  { "name":"Kentucky", "abbreviation":"KY"},
  { "name":"Tennessee", "abbreviation":"TN"},
  { "name":"Louisiana", "abbreviation":"LA"},
  { "name":"Texas", "abbreviation":"TX"},
  { "name":"Maine", "abbreviation":"ME"},
  { "name":"Utah", "abbreviation":"UT"},
  { "name":"Maryland", "abbreviation":"MD"},
  { "name":"Vermont", "abbreviation":"VT"},
  { "name":"Massachusetts", "abbreviation":"MA"},
  { "name":"Virginia", "abbreviation":"VA"},
  { "name":"Michigan", "abbreviation":"MI"},
  { "name":"Washington", "abbreviation":"WA"},
  { "name":"Minnesota", "abbreviation":"MN"},
  { "name":"West Virginia", "abbreviation":"WV"},
  { "name":"Mississippi", "abbreviation":"MS"},
  { "name":"Wisconsin", "abbreviation":"WI"},
  { "name":"Missouri", "abbreviation":"MO"},
  { "name":"Wyoming", "abbreviation":"WY"}
];

var l = states.length
  , i;

db.states.remove();

for (i = 0; i < l; i++) {
  var r = {'id': i + 1, 'name': states[i].name, 'abbreviation': states[i].abbreviation};
  db.states.insert(r);
}
