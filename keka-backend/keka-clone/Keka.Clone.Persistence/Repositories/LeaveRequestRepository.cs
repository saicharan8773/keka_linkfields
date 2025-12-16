using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Keka.Clone.Persistence.Repositories
{
    public class LeaveRequestRepository:ILeaveRequestRepository
    {
        private readonly AppDbContext _db;

        public LeaveRequestRepository(AppDbContext db)
        {
            _db = db;
        }
        public async Task<LeaveRequest?> GetByIdAsync(int id)
        {
            return await _db.LeaveRequests
                .Include(r => r.Employee)
                .Include(r=>r.LeaveType)
                .FirstOrDefaultAsync(r=>r.Id == id);
        }

        public async Task<LeaveRequest?> GetByRequestCodeAsync(string requestCode)
        {
            return await _db.LeaveRequests
                .Include(x => x.Employee)
                .Include(x => x.LeaveType)
                .FirstOrDefaultAsync(x => x.RequestCode == requestCode);
        }

        public async Task<IEnumerable<LeaveRequest>> GetAllAsync()
        {
            return await _db.LeaveRequests
                .Include(x => x.Employee)
                .Include(x => x.LeaveType)
                .ToListAsync();
        }

        public async Task<List<LeaveRequest>> GetEmployeeHistoryAsync(Guid employeeId)
        {
            return await _db.LeaveRequests
                .Include(x => x.Employee)
                .Include(x => x.LeaveType)
                .Where(x => x.EmployeeId == employeeId)
                .OrderByDescending(x => x.StartDate)
                .ToListAsync();
        }

        public async Task<List<LeaveRequest>> GetPendingRequestsAsync()
        {
            return await _db.LeaveRequests
                .Include(x => x.Employee)
                .Include(x => x.LeaveType)
                .Where(x => x.Status == Domain.Enums.LeaveStatus.Pending)
                .OrderBy(x => x.RequestedOn)
                .ToListAsync();
        }

        public async Task<IEnumerable<LeaveRequest>> GetApprovedLeaveRequestsForDateAsync(DateTime date)
        {
            var startOfDay = date.Date; 
            var endOfDay = startOfDay.AddDays(1);

            return await _db.LeaveRequests
                .Include(lr => lr.Employee)
                .Where(lr => lr.Status == Domain.Enums.LeaveStatus.Approved &&
                             lr.StartDate < endOfDay && 
                             lr.EndDate >= startOfDay)
                .ToListAsync();
        }

        public async Task AddAsync(LeaveRequest request)
        {
            await _db.LeaveRequests.AddAsync(request);
        }

        public async Task UpdateAsync(LeaveRequest request)
        {
            _db.LeaveRequests.Update(request);
            // Note: Update usually tracks changes, SaveChangesAsync commits them.
            await Task.CompletedTask;
        }

        public async Task DeleteAsync(LeaveRequest request)
        {
            _db.LeaveRequests.Remove(request);
            await Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}