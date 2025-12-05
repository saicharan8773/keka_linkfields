using Keka.Clone.Application.DTOs;
using Keka.Clone.Domain.Entities;
using System.Collections.Generic;

public interface ILeaveService
{
    Task<IEnumerable<LeaveTypeAvailabilityDto>> GetLeaveTypesAsync(Guid employeeId);
    Task<IEnumerable<LeaveHistoryItemDto>> GetLeaveHistoryAsync(Guid employeeId);
    Task<IEnumerable<LeaveHistoryItemDto>> GetPendingRequestsAsync();

    Task ApplyLeaveAsync(LeaveRequestDto dto);
    Task ApproveLeaveAsync(int requestId);
    Task RejectLeaveAsync(int requestId);
    Task ApproveLeaveByCodeAsync(string requestCode);
    Task RejectLeaveByCodeAsync(string requestCode);
    Task<int> GetRemainingLeavesAsync(Guid employeeId, int leaveTypeId);
    
    // Analytics
    Task<List<int>> GetWeeklyApprovedPatternsAsync(Guid employeeId);
    Task<Dictionary<string, int>> GetConsumedLeaveTypesStatsAsync(Guid employeeId);
    Task<List<int>> GetMonthlyApprovedStatsAsync(Guid employeeId);
}
