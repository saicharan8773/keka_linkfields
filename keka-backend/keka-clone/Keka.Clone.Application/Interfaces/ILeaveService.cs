using Keka.Clone.Application.DTOs;
using Keka.Clone.Domain.Entities;

public interface ILeaveService
{
    Task<IEnumerable<LeaveTypeAvailabilityDto>> GetLeaveTypesAsync(Guid employeeId);
    Task<IEnumerable<LeaveHistoryItemDto>> GetLeaveHistoryAsync(string employeeCode);
    Task<IEnumerable<LeaveHistoryItemDto>> GetPendingRequestsAsync();

    Task ApplyLeaveAsync(LeaveRequestDto dto);
    Task ApproveLeaveAsync(int requestId);
    Task RejectLeaveAsync(int requestId);
    Task ApproveLeaveByCodeAsync(string requestCode);
    Task RejectLeaveByCodeAsync(string requestCode);
    Task<int> GetRemainingLeavesAsync(Guid employeeId, int leaveTypeId);
}
