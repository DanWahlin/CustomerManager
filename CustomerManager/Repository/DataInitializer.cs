
using CustomerManager.Model;
using System.Collections.Generic;
namespace CustomerManager.Repository
{
    internal static class DataInitializer
    {
        internal static void Initialize(CustomerManagerContext context)
        {
            var customers = new List<Customer> {
                new Customer()
                {
                    Id = 1,
                    FirstName = "Marcus",
                    LastName = "Hightower",
                    Address = "1234 Anywhere St.",
                    City = "Phoenix",
                    State = "AZ",
                    Zip = 85229,
                    Gender = Model.Gender.Male
                },
                new Customer()
                {
                    Id = 2,
                    FirstName = "Jesse",
                    LastName = "Smith",
                    Address = "345 Main St.",
                    City = "San Francisco",
                    State = "CA",
                    Zip = 85229,
                    Gender = Model.Gender.Female,
                },
                new Customer()
                {
                    Id = 3,
                    FirstName = "Albert",
                    LastName = "Einstein",
                    Address = "1 Atomic St.",
                    City = "Atom",
                    State = "AZ",
                    Zip = 85229,
                    Gender = Model.Gender.Male,
                }
            };

            var orders = new List<Order> {
                new Order { CustomerId = 1, Product = "Basket", Price =  29.99M , Quantity=  1},
                new Order { CustomerId = 1, Product = "Yarn", Price =  9.99M, Quantity=  1  },
                new Order { CustomerId = 2, Product = "Needes", Price =  5.99M, Quantity=  1 },
                new Order { CustomerId = 2, Product = "Speakers", Price = 499.99M, Quantity =  1 },
                new Order { CustomerId = 3, Product = "iPod", Price =  399.99M, Quantity=  1 },
                new Order { CustomerId = 2, Product = "Table", Price =  329.99M, Quantity=  1 },
                new Order { CustomerId = 2, Product = "Chair", Price =  129.99M, Quantity=  4 },
                new Order { CustomerId = 3, Product = "Lamp", Price =  89.99M, Quantity=  5 },
                new Order { CustomerId = 1, Product = "Call of Duty", Price =  59.99M, Quantity=  1},
                new Order { CustomerId = 2, Product = "Controller", Price =  49.99M, Quantity=  1},
                new Order { CustomerId = 3, Product = "Gears of War", Price =  49.99M, Quantity=  1 },
                new Order { CustomerId = 3, Product = "Lego City", Price =  49.99M, Quantity=  1 },
                new Order { CustomerId = 2, Product = "Baseball", Price =  9.99M, Quantity=  5 },
                new Order { CustomerId = 1, Product = "Bat", Price =  19.99M, Quantity=  1 }
            };     

            foreach (var cust in customers)
            {
                context.Customers.Add(cust);
            }

            foreach (var order in orders)
            {
                context.Orders.Add(order);
            }

        
             
        }
    }
}
