var customerNames =
[
    "Marcus,HighTower,Male,acmecorp.com",
    "Jesse,Smith,Female,gmail.com",
    "Albert,Einstein,Male,outlook.com",
    "Dan,Wahlin,Male,yahoo.com",
    "Ward,Bell,Male,gmail.com",
    "Brad,Green,Male,gmail.com",
    "Igor,Minar,Male,gmail.com",
    "Miško,Hevery,Male,gmail.com",
    "Michelle,Avery,Female,acmecorp.com",
    "Heedy,Wahlin,Female,hotmail.com"
];
var addresses =
[
    "1234 Anywhere St.",
    "435 Main St.",
    "1 Atomic St.",
    "85 Cedar Dr.",
    "12 Ocean View St.",
    "1600 Amphitheatre Parkway",
    "1600 Amphitheatre Parkway",
    "1600 Amphitheatre Parkway",
    "1578 Main St.", "85 Cedar Dr."
];

var citiesStates =
[
    "Phoenix,AZ,Arizona",
    "Encinitas,CA,California",
    "Seattle,WA,Washington",
    "Chandler,AZ,Arizona",
    "Dallas,TX,Texas",
    "Orlando,FL,Florida",
    "Carey,NC,North Carolina",
    "Anaheim,CA,California",
    "Dallas,TX,Texas",
    "Chandler,AZ,Arizona"
];

var citiesIds = [5, 9, 44, 5, 36, 17, 16, 9, 36, 5];

var zip = 85229;

var orders =
[
  { "product": "Basket", "price":29.99, "quantity":  1},
  { "product": "Yarn", "price":9.99, "quantity":  1  },
  { "product": "Needes", "price":5.99, "quantity":  1 },
  { "product": "Speakers", "price": 499.99, "quantity":  1 },
  { "product": "iPod", "price":399.99, "quantity":  1 },
  { "product": "Table", "price":329.99, "quantity":  1 },
  { "product": "Chair", "price":129.99, "quantity":  4 },
  { "product": "Lamp", "price":89.99, "quantity":  5 },
  { "product": "Call of Duty", "price":59.99, "quantity":  1},
  { "product": "Controller", "price":49.99, "quantity":  1},
  { "product": "Gears of War", "price":49.99, "quantity":  1 },
  { "product": "Lego City", "price":49.99, "quantity":  1 },
  { "product": "Baseball", "price":9.99, "quantity":  5 },
  { "product": "Bat", "price":19.99, "quantity":  1 }
];

db = db.getSiblingDB('custmgr')

db.customers.remove();


var l = customerNames.length
  , i
  , j
  , firstOrder
  , lastOrder
  , tempOrder
  , n = orders.length;

for (i = 0; i < l; i++) {
    var nameGenderHost = customerNames[i].split(',');
    var cityState = citiesStates[i].split(',');
    var s = {'id': citiesIds[i], 'abbreviation': cityState[1], 'name': cityState[2]}
    var c = {'firstName': nameGenderHost[0]
        , 'lastName': nameGenderHost[1]
        , 'email': nameGenderHost[0] + '.' + nameGenderHost[1] + '@' + nameGenderHost[3]
        , 'address': addresses[i]
        , 'city': cityState[0]
        , 'state': s
        , 'stateId': citiesIds[i]
        , 'zip': zip + i
        , 'gender': nameGenderHost[2]
        , 'id': i + 1
        , 'orderCount' : 0
    };
    firstOrder = Math.floor(Math.random() * orders.length);
    lastOrder = Math.floor(Math.random() * orders.length);
    if (firstOrder > lastOrder) {
        tempOrder = firstOrder;
        firstOrder = lastOrder;
        lastOrder = tempOrder;
    }

    c.orders = [];
    print('firstOrder: ' + firstOrder + ", lastOrder: " + lastOrder);
    for (j = firstOrder; j <= lastOrder && j < n; j++) {
        var o = { "product": orders[j].product, "price": orders[j].price, "quantity": orders[j].quantity};
        c.orders.push(o);
    }
    c.orderCount = c.orders.length;

    db.customers.insert(c);
}



