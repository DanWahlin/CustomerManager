using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CustomerManager.Model
{
    public class CustomerSummary
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public State State { get; set; }
        public int OrderCount { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public Gender Gender { get; set; }
    }
}