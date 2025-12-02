using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Keka.Clone.Application.DTOs;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;
using Keka.Clone.Domain.Enums;

namespace Keka.Clone.Application.Services
{
    public class LeaveService:ILeaveService
    {
        private readonly ILeaveRequestRepository _leaveRequestRepo;
        private readonly IEmployeeLeaveAllocationRepository _allocationRepo;
        private readonly ILeaveTypeRepository _leaveTypeRepo;
        private readonly INotificationService _notificationService;

        public LeaveService(
            ILeaveRequestRepository leaveRequestRepo,
            IEmployeeLeaveAllocationRepository allocationRepo,
            ILeaveTypeRepository leaveTypeRepo,
            INotificationService notificationService)
        {
            _leaveRequestRepo = leaveRequestRepo;
            _allocationRepo = allocationRepo;
            _leaveTypeRepo = leaveTypeRepo;
            _notificationService = notificationService;
        }

        public async Task<IEnumerable<LeaveTypeAvailabilityDto>> GetLeaveTypesAsync(Guid employeeId)
        {
            var currentYear = DateTime.UtcNow.Year;
            var leaveTypes = await _leaveTypeRepo.GetAllAsync();
            var allocations = await _allocationRepo.GetAllForEmployeeAsync(employeeId, currentYear);
            var allocationLookup = allocations.ToDictionary(x => x.LeaveTypeId, x => x);

            return leaveTypes.Select(type =>
            {
                allocationLookup.TryGetValue(type.Id, out var allocation);
                var remaining = allocation?.RemainingDays ?? 0;

                return new LeaveTypeAvailabilityDto
                {
                    LeaveTypeId = type.Id,
                    LeaveTypeName = type.Name,
                    RemainingDays = type.IsUnlimited ? null : remaining,
                    IsUnlimited = type.IsUnlimited,
                    AvailabilityLabel = BuildAvailabilityLabel(type, remaining)
                };
            });
        }

        public async Task ApplyLeaveAsync(LeaveRequestDto dto)
        {
            var leaveType = await _leaveTypeRepo.GetByIdAsync(dto.LeaveTypeId)
                ?? throw new Exception("Leave type not found.");

            int daysRequested = (dto.EndDate - dto.StartDate).Days + 1;

            if (daysRequested <= 0)
                throw new Exception("End date must be after start date.");

            EmployeeLeaveAllocation? allocation = null;

            if (!leaveType.IsUnlimited)
            {
                allocation = await _allocationRepo.GetForEmployeeAsync(dto.EmployeeId, dto.LeaveTypeId, DateTime.UtcNow.Year);

                if (allocation == null)
                    throw new Exception("Leave allocation not found for this employee and leave type.");

                if (allocation.RemainingDays < daysRequested)
                    throw new Exception("Not enough leave balance.");
            }

            var request = new LeaveRequest
            {
                RequestCode = GenerateRequestCode(dto.EmployeeId, dto.LeaveTypeId),
                EmployeeId = dto.EmployeeId,
                LeaveTypeId = dto.LeaveTypeId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Reason = dto.Reason,
                Status = LeaveStatus.Pending,
                RequestedOn = DateTime.UtcNow
            };

            await _leaveRequestRepo.AddAsync(request);
            await _leaveRequestRepo.SaveChangesAsync();

            // Notify Admin
            await _notificationService.NotifyAsync("Admin", "New Leave Request", $"Employee {dto.EmployeeId} has requested leave.");
        }

        public async Task ApproveLeaveAsync(int requestId)
        {
            var request = await _leaveRequestRepo.GetByIdAsync(requestId);

            if (request == null)
                throw new Exception("Request not found.");

            if (request.Status != LeaveStatus.Pending)
                throw new Exception("Only pending leave requests can be approved.");

            var leaveType = await _leaveTypeRepo.GetByIdAsync(request.LeaveTypeId)
                ?? throw new Exception("Leave type not found.");

            if (!leaveType.IsUnlimited)
            {
                int days = (request.EndDate - request.StartDate).Days + 1;

                var allocation = await _allocationRepo.GetForEmployeeAsync(request.EmployeeId, request.LeaveTypeId, DateTime.UtcNow.Year)
                    ?? throw new Exception("Allocation not found.");

                if (allocation.RemainingDays < days)
                    throw new Exception("Insufficient balance at approval time.");

                allocation.RemainingDays -= days;
                await _allocationRepo.UpdateAsync(allocation);
                await _allocationRepo.SaveChangesAsync();
            }

            request.Status = LeaveStatus.Approved;
            request.ActionDate = DateTime.UtcNow;

            await _leaveRequestRepo.UpdateAsync(request);
            await _leaveRequestRepo.SaveChangesAsync();

            // Notify Employee
            await _notificationService.NotifyAsync(request.EmployeeId.ToString(), "Leave Approved", "Your leave request has been approved.");
        }

        public async Task RejectLeaveAsync(int requestId)
        {
            var request = await _leaveRequestRepo.GetByIdAsync(requestId);

            if (request == null)
                throw new Exception("Request not found.");

            if (request.Status != LeaveStatus.Pending)
                throw new Exception("Only pending leave requests can be rejected.");

            request.Status = LeaveStatus.Rejected;
            request.ActionDate = DateTime.UtcNow;

            await _leaveRequestRepo.UpdateAsync(request);
            await _leaveRequestRepo.SaveChangesAsync();

            // Notify Employee
            await _notificationService.NotifyAsync(request.EmployeeId.ToString(), "Leave Rejected", "Your leave request has been rejected.");
        }

        public async Task ApproveLeaveByCodeAsync(string requestCode)
        {
            if (string.IsNullOrWhiteSpace(requestCode))
                throw new Exception("Request code is required.");

            var request = await _leaveRequestRepo.GetByRequestCodeAsync(requestCode)
                ?? throw new Exception("Leave request not found for the given code.");

            await ApproveLeaveAsync(request.Id);
        }

        public async Task RejectLeaveByCodeAsync(string requestCode)
        {
            if (string.IsNullOrWhiteSpace(requestCode))
                throw new Exception("Request code is required.");

            var request = await _leaveRequestRepo.GetByRequestCodeAsync(requestCode)
                ?? throw new Exception("Leave request not found for the given code.");

            await RejectLeaveAsync(request.Id);
        }

        public async Task<IEnumerable<LeaveHistoryItemDto>> GetLeaveHistoryAsync(Guid employeeId)
        {
            var history = await _leaveRequestRepo.GetEmployeeHistoryAsync(employeeId);

            return history.Select(MapToHistoryItemDto);
        }

        public async Task<IEnumerable<LeaveHistoryItemDto>> GetPendingRequestsAsync()
        {
            var requests = await _leaveRequestRepo.GetPendingRequestsAsync();
            return requests.Select(MapToHistoryItemDto);
        }

        public async Task<int> GetRemainingLeavesAsync(Guid employeeId, int leaveTypeId)
        {
            var leaveType = await _leaveTypeRepo.GetByIdAsync(leaveTypeId)
                ?? throw new Exception("Leave type not found.");

            if (leaveType.IsUnlimited)
                return int.MaxValue;

            var allocation = await _allocationRepo.GetForEmployeeAsync(employeeId, leaveTypeId, DateTime.UtcNow.Year);
            return allocation?.RemainingDays ?? 0;
        }

        private LeaveHistoryItemDto MapToHistoryItemDto(LeaveRequest item)
        {
            return new LeaveHistoryItemDto
            {
                RequestId = item.Id,
                RequestCode = item.RequestCode,
                LeaveType = item.LeaveType?.Name ?? string.Empty,
                LeaveTypeNote = $"Requested on {item.RequestedOn:dd MMM yyyy}",
                StartDate = item.StartDate,
                EndDate = item.EndDate,
                TotalDays = (item.EndDate - item.StartDate).Days + 1,
                Status = item.Status.ToString(),
                StatusDetail = BuildStatusDetail(item),
                RequestedBy = item.Employee != null
                    ? $"{item.Employee.FirstName} {item.Employee.LastName}".Trim()
                    : string.Empty,
                RequestedOn = item.RequestedOn,
                ActionedOn = item.ActionDate,
                Note = item.Reason
            };
        }

        private static string BuildAvailabilityLabel(LeaveType leaveType, int remainingDays)
        {
            if (leaveType.IsUnlimited)
                return "infinite balance";

            if (remainingDays <= 0)
                return "Not Available";

            return remainingDays == 1
                ? "1 day available"
                : $"{remainingDays} days available";
        }

        private static string BuildStatusDetail(LeaveRequest request) =>
            request.Status switch
            {
                LeaveStatus.Approved when request.ActionDate.HasValue => $"Approved on {request.ActionDate:dd MMM yyyy}",
                LeaveStatus.Rejected when request.ActionDate.HasValue => $"Rejected on {request.ActionDate:dd MMM yyyy}",
                _ => $"Requested on {request.RequestedOn:dd MMM yyyy}"
            };

        private static string GenerateRequestCode(Guid employeeId, int leaveTypeId)
        {
            // Example format: LR-20251201HHMMSS-EMPxxxx-LTyy-rand
            var empFragment = employeeId.ToString("N")[..6];
            var randomFragment = Guid.NewGuid().ToString("N")[..4];
            return $"LR-{DateTime.UtcNow:yyyyMMddHHmmss}-{empFragment}-LT{leaveTypeId}-{randomFragment}";
        }
    }
}