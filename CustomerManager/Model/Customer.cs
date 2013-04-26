using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CustomerManager.Model
{
    public class Customer
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public int Zip { get; set; }
        public ICollection<Order> Orders { get; set; }
    }
}