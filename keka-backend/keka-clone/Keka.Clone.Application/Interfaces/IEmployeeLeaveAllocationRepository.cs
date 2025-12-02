using System.Collections.Generic;
using System.Threading.Tasks;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Interfaces
{
    public interface IEmployeeLeaveAllocationRepository
    {
        Task<EmployeeLeaveAllocation?> GetForEmployeeAsync(Guid employeeId, int leaveTypeId, int year);
        Task<List<EmployeeLeaveAllocation>> GetAllForEmployeeAsync(Guid employeeId, int year);
        Task AddRangeAsync(IEnumerable<EmployeeLeaveAllocation> allocations);
        Task UpdateAsync(EmployeeLeaveAllocation allocation);

        Task SaveChangesAsync();
    }
}   
