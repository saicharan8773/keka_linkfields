using System.Collections.Generic;
using System.Threading.Tasks;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Interfaces
{
    public interface ILeaveRequestRepository
    {
        Task<LeaveRequest?> GetByIdAsync(int id);
        Task<LeaveRequest?> GetByRequestCodeAsync(string requestCode);
        Task<IEnumerable<LeaveRequest>> GetAllAsync();

        // Updated: Get history using EmployeeCode (string)
        Task<List<LeaveRequest>> GetEmployeeHistoryByCodeAsync(string employeeCode);

        Task<List<LeaveRequest>> GetPendingRequestsAsync();

        Task AddAsync(LeaveRequest request);
        Task UpdateAsync(LeaveRequest request);
        Task DeleteAsync(LeaveRequest request);
        Task SaveChangesAsync();
    }
}
