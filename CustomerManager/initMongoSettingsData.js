db = db.getSiblingDB('custmgr')

db.settings.remove();

var r = {'nextSeqNumber': 11, 'collectionName': "customers"};
db.settings.insert(r);
