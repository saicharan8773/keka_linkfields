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

        // Get history for a specific employee by Id
        Task<List<LeaveRequest>> GetEmployeeHistoryAsync(Guid employeeId);

        Task<List<LeaveRequest>> GetPendingRequestsAsync();

        Task AddAsync(LeaveRequest request);
        Task UpdateAsync(LeaveRequest request);
        Task DeleteAsync(LeaveRequest request);
        Task SaveChangesAsync();
    }
}
