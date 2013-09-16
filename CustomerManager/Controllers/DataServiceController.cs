using CustomerManager.Model;
using CustomerManager.Repository;
using System;
using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace CustomerManager.Controllers
{
    public class DataServiceController : ApiController
    {
        CustomerManagerContext _Context;

        public DataServiceController()
        {
            _Context = new CustomerManagerContext();
            //System.Threading.Thread.Sleep(5000); 
        }

        [HttpGet]
        [Queryable]
        public IQueryable<Customer> Customers()
        {
            var query = _Context.Customers
                    .Include("Orders")
                    .Include("State")
                    .OrderBy(c => c.LastName);
            var totalRecords = query.Count();
            HttpContext.Current.Response.Headers.Add("X-InlineCount", totalRecords.ToString());
            return query.AsQueryable();
        }

        [HttpGet]
        public List<State> States()
        {
            return _Context.States.OrderBy(s => s.Name).ToList();
        }

        [HttpGet]
        [Queryable]
        public IQueryable<CustomerSummary> CustomersSummary()
        {
            var query = _Context.Customers
                           .Include("States")
                           .OrderBy(c => c.LastName);
            var totalRecords = query.Count();
            HttpContext.Current.Response.Headers.Add("X-InlineCount", totalRecords.ToString());
            return query.Select(c => new CustomerSummary
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                City = c.City,
                State = c.State,
                OrderCount = c.Orders.Count(),
                Gender = c.Gender
            }).AsQueryable();
        }

        [HttpGet]
        public OperationStatus CheckUnique(int id, string property, string value)
        {
            switch (property.ToLower())
            {
                case "email":
                    var unique = !_Context.Customers.Any(c => c.Id != id && c.Email == value);
                    return new OperationStatus { Status = unique };
                default:
                    return new OperationStatus();
            }
            
        }

        // GET api/<controller>/5
        [HttpGet]
        public Customer CustomerById(int id)
        {
            return _Context.Customers
                    .Include("Orders")
                    .Include("State")
                    .SingleOrDefault(c => c.Id == id);
        }

        // POST api/<controller>
        public HttpResponseMessage PostCustomer([FromBody]Customer customer)
        {
            var opStatus = new OperationStatus();
            try
            {
                _Context.Customers.Add(customer);
                _Context.SaveChanges();
                var response = Request.CreateResponse<Customer>(HttpStatusCode.Created, customer);
                string uri = Url.Link("DefaultApi", new { id = customer.Id });
                response.Headers.Location = new Uri(uri);
                return response;
            }
            catch (Exception exp)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, exp.Message);
            }
        }

        // PUT api/<controller>/5
        public HttpResponseMessage PutCustomer(int id, [FromBody]Customer customer)
        {
            var opStatus = new OperationStatus();
            try
            {
                //customer.State.Id = customer.StateId;
                _Context.Customers.Attach(customer);
                _Context.Entry<Customer>(customer).State = System.Data.EntityState.Modified;
                _Context.SaveChanges();
                return Request.CreateResponse<Customer>(HttpStatusCode.Accepted, customer);
            }
            catch (Exception exp)
            {
                return Request.CreateResponse(HttpStatusCode.NotModified, exp.Message);
            }
        }

        // DELETE api/<controller>/5
        public HttpResponseMessage DeleteCustomer(int id)
        {
            var opStatus = new OperationStatus();
            try
            {
                var cust = _Context.Customers.SingleOrDefault(c => c.Id == id);
                if (cust != null)
                {
                    _Context.Customers.Remove(cust);
                    _Context.SaveChanges();
                    return Request.CreateResponse(HttpStatusCode.OK);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }
            }
            catch (Exception exp)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, exp.Message);
            }
        }
    }
}