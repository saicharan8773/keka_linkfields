using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Keka.Clone.Application.DTOs;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Interfaces
{
    public interface ILeaveService
    {
        Task ApplyLeaveAsync(LeaveRequestDto dto);
        Task ApproveLeaveAsync(string requestId);
        Task RejectLeaveAsync(string requestId);
        Task<IEnumerable<LeaveRequest>> GetLeaveHistoryAsync(string employeeCode);

        // Fixed: Changed int employeeId to Guid employeeId
        Task<int> GetRemainingLeavesAsync(Guid employeeId, int leaveTypeId);
    }
}