using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace CustomerManager.Repository
{
    ////DropCreateDatabaseIfModelChanges<TodosContext>
    public class CustomerManagerDatabaseInitializer : DropCreateDatabaseAlways<CustomerManagerContext> // re-creates every time the server starts
    {
        protected override void Seed(CustomerManagerContext context)
        {
            DataInitializer.Initialize(context);
            base.Seed(context);
        }
    }
}
