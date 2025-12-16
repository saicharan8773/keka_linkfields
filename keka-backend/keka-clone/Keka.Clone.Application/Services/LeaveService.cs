using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Keka.Clone.Application.DTOs;
using Keka.Clone.Application.DTOs.Employee;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;
using Keka.Clone.Domain.Enums;
using AutoMapper;

namespace Keka.Clone.Application.Services
{
    public class LeaveService:ILeaveService
    {
        private readonly ILeaveRequestRepository _leaveRequestRepo;
        private readonly IEmployeeLeaveAllocationRepository _allocationRepo;
        private readonly ILeaveTypeRepository _leaveTypeRepo;
        private readonly INotificationService _notificationService;
        private readonly IEmailService _emailService;
        private readonly IEmployeeRepository _employeeRepo;
        private readonly IMapper _mapper;

        public LeaveService(
            ILeaveRequestRepository leaveRequestRepo,
            IEmployeeLeaveAllocationRepository allocationRepo,
            ILeaveTypeRepository leaveTypeRepo,
            INotificationService notificationService,
            IEmailService emailService,
            IEmployeeRepository employeeRepo,
            IMapper mapper)
        {
            _leaveRequestRepo = leaveRequestRepo;
            _allocationRepo = allocationRepo;
            _leaveTypeRepo = leaveTypeRepo;
            _notificationService = notificationService;
            _emailService = emailService;
            _employeeRepo = employeeRepo;
            _mapper = mapper;
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

            // Send Email Notifications
            var employee = await _employeeRepo.GetByIdAsync(dto.EmployeeId);
            if (employee != null)
            {
                var employeePlaceholders = new Dictionary<string, string>
                {
                    { "EmployeeName", $"{employee.FirstName} {employee.LastName}" },
                    { "LeaveType", leaveType.Name },
                    { "StartDate", dto.StartDate.ToString("dd MMM yyyy") },
                    { "EndDate", dto.EndDate.ToString("dd MMM yyyy") },
                    { "Reason", dto.Reason }
                };
                await _emailService.SendTemplateAsync("bharadwajbva10@gmail.com", "Leave Request Submitted", "LeaveRequestEmployeeConfirmation.html", employeePlaceholders);

                if (employee.ManagerId.HasValue)
                {
                    var manager = await _employeeRepo.GetByIdAsync(employee.ManagerId.Value);
                    if (manager != null)
                    {
                        var managerPlaceholders = new Dictionary<string, string>
                        {
                            { "ManagerName", $"{manager.FirstName} {manager.LastName}" },
                            { "EmployeeName", $"{employee.FirstName} {employee.LastName}" },
                            { "LeaveType", leaveType.Name },
                            { "StartDate", dto.StartDate.ToString("dd MMM yyyy") },
                            { "EndDate", dto.EndDate.ToString("dd MMM yyyy") },
                            { "Reason", dto.Reason }
                        };
                        await _emailService.SendTemplateAsync(manager.WorkEmail, "New Leave Request", "LeaveRequestManagerNotification.html", managerPlaceholders);
                    }
                }
            }
        }

        public async Task ApproveLeaveAsync(int requestId,string requesttext)
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
            
            var managerresponce = new Dictionary<string, string>
            {
                {"EmployeeName", $"{request.Employee.FirstName} {request.Employee.LastName}" },
                {"ManagerComment",requesttext },
            };

            if (request.Employee != null)
            {
                await _emailService.SendTemplateAsync("bbharadwaj@linkfields.com", "Leave request approved", "LeaveResponse.html", managerresponce);
            }

            // Notify Employee
            await _notificationService.NotifyAsync(request.EmployeeId.ToString(), "Leave Approved", "Your leave request has been approved.");
        }

        public async Task RejectLeaveAsync(int requestId, string managerComment)
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
            
            var employeeName = "Unknown";
            if (request.Employee != null)
            {
                employeeName = !string.IsNullOrWhiteSpace(request.Employee.DisplayName)
                    ? request.Employee.DisplayName
                    : $"{request.Employee.FirstName} {request.Employee.LastName}".Trim();
            }

            var managerResponce = new Dictionary<string, string>
            {
                {"EmployeeName", employeeName},
                {"ManagerComment", managerComment },
            };

            if (request.Employee != null)
            {
                await _emailService.SendTemplateAsync(request.Employee.WorkEmail, "Leave request rejected", "LeaveResponse.html", managerResponce);
            }

            // Notify Employee
            await _notificationService.NotifyAsync(request.EmployeeId.ToString(), "Leave Rejected", "Your leave request has been rejected.");
        }

        public async Task ApproveLeaveByCodeAsync(string requestCode, string requesttext)
        {
            if (string.IsNullOrWhiteSpace(requestCode))
                throw new Exception("Request code is required.");

            var request = await _leaveRequestRepo.GetByRequestCodeAsync(requestCode)
                ?? throw new Exception("Leave request not found for the given code.");
            await ApproveLeaveAsync(request.Id, requesttext);
        }

        public async Task RejectLeaveByCodeAsync(string requestCode, string managerComment)
        {
            if (string.IsNullOrWhiteSpace(requestCode))
                throw new Exception("Request code is required.");

            var request = await _leaveRequestRepo.GetByRequestCodeAsync(requestCode)
                ?? throw new Exception("Leave request not found for the given code.");

            await RejectLeaveAsync(request.Id, managerComment);
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

        public async Task<List<int>> GetWeeklyApprovedPatternsAsync(Guid employeeId)
        {
            var history = await _leaveRequestRepo.GetEmployeeHistoryAsync(employeeId);
            var approved = history.Where(x => x.Status == LeaveStatus.Approved);

            var weeklyCounts = new int[7]; // 0=Mon, ... 6=Sun

            foreach (var req in approved)
            {
                for (var date = req.StartDate; date <= req.EndDate; date = date.AddDays(1))
                {
                    // DayOfWeek: Sunday=0, Monday=1, ..., Saturday=6
                    // We want Mon=0, ..., Sun=6
                    int dayIndex = (int)date.DayOfWeek; 
                    int adjustedIndex = (dayIndex == 0) ? 6 : dayIndex - 1;
                    weeklyCounts[adjustedIndex]++;
                }
            }

            return weeklyCounts.ToList();
        }

        public async Task<Dictionary<string, int>> GetConsumedLeaveTypesStatsAsync(Guid employeeId)
        {
            var history = await _leaveRequestRepo.GetEmployeeHistoryAsync(employeeId);
            var approved = history.Where(x => x.Status == LeaveStatus.Approved);
            
            var stats = new Dictionary<string, int>();

            foreach (var req in approved)
            {
                var typeName = req.LeaveType?.Name ?? $"Type {req.LeaveTypeId}";
                int days = (req.EndDate - req.StartDate).Days + 1;
                
                if (stats.ContainsKey(typeName))
                    stats[typeName] += days;
                else
                    stats[typeName] = days;
            }

            return stats;
        }

        public async Task<List<int>> GetMonthlyApprovedStatsAsync(Guid employeeId)
        {
            var history = await _leaveRequestRepo.GetEmployeeHistoryAsync(employeeId);
            var approved = history.Where(x => x.Status == LeaveStatus.Approved);

            var monthlyCounts = new int[12]; // 0=Jan

            foreach (var req in approved)
            {
                for (var date = req.StartDate; date <= req.EndDate; date = date.AddDays(1))
                {
                    monthlyCounts[date.Month - 1]++;
                }
            }

            return monthlyCounts.ToList();
        }
        public async Task<IEnumerable<EmployeeDto>> GetEmployeesOnLeaveAsync(DateTime date)
        {
            var leaveRequests = await _leaveRequestRepo.GetApprovedLeaveRequestsForDateAsync(date);

            var employeesOnLeave = leaveRequests.Select(lr => lr.Employee).Where(emp => emp != null).Distinct();

            return _mapper.Map<IEnumerable<EmployeeDto>>(employeesOnLeave);
        }

        private static string GenerateRequestCode(Guid employeeId, int leaveTypeId)
        {
            var empFragment = employeeId.ToString("N")[..6];
            var randomFragment = Guid.NewGuid().ToString("N")[..4];
            return $"LR-{DateTime.UtcNow:yyyyMMddHHmmss}-{empFragment}-LT{leaveTypeId}-{randomFragment}";
        }
    }
}