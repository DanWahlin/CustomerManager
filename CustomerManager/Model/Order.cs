using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace CustomerManager.Model
{
    public class Order
    {
        public int Id { get; set; }
        [StringLength(50)]
        public string Product { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public DateTime Date { get; set; }
        public int CustomerId { get; set; }
        public Customer Customer { get; set; }

        public Order Clone()
        {
            return (Order)this.MemberwiseClone();
        }
    }
}