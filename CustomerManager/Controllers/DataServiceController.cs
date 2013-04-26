using CustomerManager.Model;
using CustomerManager.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CustomerManager.Controllers
{
    public class DataServiceController : ApiController
    {
        CustomerManagerContext _Context;

        public DataServiceController()
        {
            _Context = new CustomerManagerContext();
        }

        [HttpGet]
        public IQueryable<Customer> Customers()
        {
            return _Context.Customers.Include("Orders");
        }

        [HttpGet]
        public IQueryable<CustomerSummary> CustomersSummary()
        {
            return _Context.Customers.Select(c => new CustomerSummary
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                City = c.City,
                OrderCount = c.Orders.Count()
            });
        }

        // GET api/<controller>/5
        [HttpGet]
        public Customer CustomerById(int id)
        {
            return _Context.Customers.Include("Orders").SingleOrDefault(c => c.Id == id);
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}