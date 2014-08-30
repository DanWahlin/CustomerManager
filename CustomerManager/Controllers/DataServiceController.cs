using CustomerManager.Model;
using CustomerManager.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace CustomerManager.Controllers
{
    public class DataServiceController : ApiController
    {
        CustomerRepository _Repository;

        public DataServiceController()
        {
            _Repository = new CustomerRepository();
        }

        [HttpGet]
        [Queryable]
        public HttpResponseMessage Customers()
        {
            var customers = _Repository.GetCustomers();
            var totalRecords = customers.Count();
            HttpContext.Current.Response.Headers.Add("X-InlineCount", totalRecords.ToString());
            return Request.CreateResponse(HttpStatusCode.OK, customers);
        }

        [HttpGet]
        public HttpResponseMessage States()
        {
            var states = _Repository.GetStates();
            return Request.CreateResponse(HttpStatusCode.OK, states);
        }

        [HttpGet]
        [Queryable]
        public HttpResponseMessage CustomersSummary()
        {
            int totalRecords;
            var custSummary = _Repository.GetCustomersSummary(out totalRecords);
            HttpContext.Current.Response.Headers.Add("X-InlineCount", totalRecords.ToString());
            return Request.CreateResponse(HttpStatusCode.OK, custSummary);
        }

        [HttpGet]
        public HttpResponseMessage CheckUnique(int id, string property, string value)
        {
            var opStatus = _Repository.CheckUnique(id, property, value);
            return Request.CreateResponse(HttpStatusCode.OK, opStatus);
        }

        [HttpPost]
        public HttpResponseMessage Login([FromBody]UserLogin userLogin)
        {
            //Simulated login
            return Request.CreateResponse(HttpStatusCode.OK, new { status = true});
        }

        [HttpPost]
        public HttpResponseMessage Logout()
        {
            //Simulated logout
            return Request.CreateResponse(HttpStatusCode.OK, new { status = true });
        }

        // GET api/<controller>/5
        [HttpGet]
        public HttpResponseMessage CustomerById(int id)
        {
            var customer = _Repository.GetCustomerById(id);
            return Request.CreateResponse(HttpStatusCode.OK, customer);
        }

        // POST api/<controller>
        public HttpResponseMessage PostCustomer([FromBody]Customer customer)
        {
            var opStatus = _Repository.InsertCustomer(customer);
            if (opStatus.Status)
            {
                var response = Request.CreateResponse<Customer>(HttpStatusCode.Created, customer);
                string uri = Url.Link("DefaultApi", new { id = customer.Id });
                response.Headers.Location = new Uri(uri);
                return response;
            }
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, opStatus.ExceptionMessage);
        }

        // PUT api/<controller>/5
        public HttpResponseMessage PutCustomer(int id, [FromBody]Customer customer)
        {
            var opStatus = _Repository.UpdateCustomer(customer);
            if (opStatus.Status)
            {
                return Request.CreateResponse<Customer>(HttpStatusCode.Accepted, customer);
            }
            return Request.CreateErrorResponse(HttpStatusCode.NotModified, opStatus.ExceptionMessage);
        }

        // DELETE api/<controller>/5
        public HttpResponseMessage DeleteCustomer(int id)
        {
            var opStatus = _Repository.DeleteCustomer(id);

            if (opStatus.Status)
            {
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, opStatus.ExceptionMessage);
            }
        }
    }
}