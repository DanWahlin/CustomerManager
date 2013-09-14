using System;
using System.Diagnostics;

namespace CustomerManager.Model
{
    [DebuggerDisplay("Status: {Status}")]
    public class OperationStatus
    {
        public bool Status { get; set; }
        public int RecordsAffected { get; set; }
        public string Message { get; set; }
        public Object OperationId { get; set; }
        public string ExceptionMessage { get; set; }
        public string ExceptionStackTrace { get; set; }
        public string ExceptionInnerMessage { get; set; }
        public string ExceptionInnerStackTrace { get; set; }

        public static OperationStatus CreateFromException(string message, Exception ex)
        {
            OperationStatus opStatus = new OperationStatus
            {
                Status = false,
                Message = message,
                OperationId = null
            };

            if (ex != null)
            {
                opStatus.ExceptionMessage = ex.Message;
                opStatus.ExceptionStackTrace = ex.StackTrace;
                opStatus.ExceptionInnerMessage = (ex.InnerException == null) ? null : ex.InnerException.Message;
                opStatus.ExceptionInnerStackTrace = (ex.InnerException == null) ? null : ex.InnerException.StackTrace;
            }
            return opStatus;
        }
    }
}
