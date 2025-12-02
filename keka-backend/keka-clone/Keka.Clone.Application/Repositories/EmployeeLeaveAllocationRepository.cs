using System.Threading.Tasks;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace Keka.Clone.Persistence.Repositories
{
    public class EmployeeLeaveAllocationRepository:IEmployeeLeaveAllocationRepository
    {
        private readonly AppDbContext _db;

        public EmployeeLeaveAllocationRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<EmployeeLeaveAllocation?> GetForEmployeeAsync(Guid employeeId, int leaveTypeId, int year)
        {
            return await _db.EmployeeLeaveAllocations
                .FirstOrDefaultAsync(x => x.EmployeeId == employeeId
                                       && x.LeaveTypeId == leaveTypeId
                                       && x.Year == year);
        }
        public async Task<List<EmployeeLeaveAllocation>> GetAllForEmployeeAsync(Guid employeeId, int year)
        {
            return await _db.EmployeeLeaveAllocations
                .Where(x => x.EmployeeId == employeeId && x.Year == year)
                .ToListAsync();
        }
        public async Task AddRangeAsync(IEnumerable<EmployeeLeaveAllocation> allocations)
        {
            await _db.EmployeeLeaveAllocations.AddRangeAsync(allocations);
        }

        public async Task UpdateAsync(EmployeeLeaveAllocation allocation)
        {
            _db.EmployeeLeaveAllocations.Update(allocation);
            // Do not SaveChanges here; caller controls SaveChangesAsync
            await Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}
