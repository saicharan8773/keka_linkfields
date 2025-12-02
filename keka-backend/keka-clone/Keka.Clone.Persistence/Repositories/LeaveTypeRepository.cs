using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Keka.Clone.Persistence.Repositories
{
    public class LeaveTypeRepository : ILeaveTypeRepository
    {
        private readonly AppDbContext _db;

        public LeaveTypeRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<LeaveType>> GetAllAsync() =>
            await _db.LeaveTypes.OrderBy(x => x.Name).ToListAsync();

        public async Task<LeaveType?> GetByIdAsync(int id) =>
            await _db.LeaveTypes.FirstOrDefaultAsync(x => x.Id == id);
    }
}

