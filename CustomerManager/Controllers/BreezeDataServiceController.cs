using CustomerManager.Model;
using CustomerManager.Repository;
using Breeze.WebApi;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CustomerManager.Controllers
{
    [BreezeController]
    public class BreezeDataServiceController : ApiController
    {
        readonly EFContextProvider<CustomerManagerContext> _contextProvider =
            new EFContextProvider<CustomerManagerContext>();

        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        [HttpGet]
        public IQueryable<Customer> Customers()
        {
            return _contextProvider.Context.Customers;
        }

        [HttpGet]
        public IQueryable<CustomerSummary> CustomersSummary()
        {
            return _contextProvider.Context.Customers.Select(c => 
                new CustomerSummary
                { 
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    City = c.City,
                    OrderCount = c.Orders.Count()                    
                });
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _contextProvider.SaveChanges(saveBundle);
        }

    }
}