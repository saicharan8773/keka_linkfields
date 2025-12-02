using System.Collections.Generic;
using System.Threading.Tasks;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Interfaces
{
    public interface ILeaveTypeRepository
    {
        Task<List<LeaveType>> GetAllAsync();
        Task<LeaveType?> GetByIdAsync(int id);
    }
}

