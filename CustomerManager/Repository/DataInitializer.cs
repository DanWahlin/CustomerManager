using CustomerManager.Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CustomerManager.Repository
{
    internal static class DataInitializer
    {
        internal static void Initialize(CustomerManagerContext context)
        {
            var random = new Random();

            //Generate customers and orders
            for (int i = 0; i < customerNames.Length; i++)
            {
                var nameGender = SplitValue(customerNames[i]);
                var cityState = SplitValue(citiesStates[i]);
                var cust = new Customer 
                {
                    Id = i + 1,
                    FirstName = nameGender[0],
                    LastName = nameGender[1],
                    Address = addresses[i],
                    City = cityState[0],
                    State = cityState[1],
                    Zip = zip + i,
                    Gender = (Gender)Enum.Parse(typeof(Gender), nameGender[2])
                };
                context.Customers.Add(cust);

                //Generate customer orders
                var skip = random.Next(orders.Count - 1);
                var take = orders.Count - skip;
                var custOrders = orders.Skip(skip).Take(take);
                foreach (var order in custOrders)
                {
                    var custOrder = order.Clone();
                    custOrder.CustomerId = cust.Id;
                    context.Orders.Add(custOrder);
                }
            }     
             
        }

        private static string[] SplitValue(string val)
        {
            return val.Split(' ');
        }

        static string[] customerNames = 
        { 
            "Marcus HighTower Male", 
            "Jesse Smith Female", 
            "Albert Einstein Male", 
            "Dan Wahlin Male", 
            "Ward Bell Male", 
            "Brad Green Male", 
            "Igor Minar Male", 
            "Miško Hevery Male", 
            "Michelle Avery Female", 
            "Heedy Wahlin Female" 
        };
        static string[] addresses = 
        { 
            "1234 Anywhere St.", 
            "435 Main St.", 
            "1 Atomic St.", 
            "85 Cedar Dr.", 
            "12 Ocean View St.", 
            "1600 Amphitheatre Parkway", 
            "1600 Amphitheatre Parkway", 
            "1600 Amphitheatre Parkway", 
            "1578 Main St.", "85 Cedar Dr." 
        };

        static string[] citiesStates = 
        { 
            "Phoenix AZ", 
            "San Diego CA", 
            "Seattle WA", 
            "Chandler AZ", 
            "San Francisco CA", 
            "Mountain View CA", 
            "Mountain View CA", 
            "Mountain View CA", 
            "Dallas TX", 
            "Chandler AZ" 
        };

        static int zip = 85229;

        static List<Order> orders = new List<Order> 
        {
            new Order { Product = "Basket", Price =  29.99M , Quantity=  1},
            new Order { Product = "Yarn", Price =  9.99M, Quantity=  1  },
            new Order { Product = "Needes", Price =  5.99M, Quantity=  1 },
            new Order { Product = "Speakers", Price = 499.99M, Quantity =  1 },
            new Order { Product = "iPod", Price =  399.99M, Quantity=  1 },
            new Order { Product = "Table", Price =  329.99M, Quantity=  1 },
            new Order { Product = "Chair", Price =  129.99M, Quantity=  4 },
            new Order { Product = "Lamp", Price =  89.99M, Quantity=  5 },
            new Order { Product = "Call of Duty", Price =  59.99M, Quantity=  1},
            new Order { Product = "Controller", Price =  49.99M, Quantity=  1},
            new Order { Product = "Gears of War", Price =  49.99M, Quantity=  1 },
            new Order { Product = "Lego City", Price =  49.99M, Quantity=  1 },
            new Order { Product = "Baseball", Price =  9.99M, Quantity=  5 },
            new Order { Product = "Bat", Price =  19.99M, Quantity=  1 }
        };    
    }
}
