using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Keka.Clone.Application.DTOs.Employee;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Keka.Clone.Application.Services
{
    public class EmployeeService:IEmployeeService
    {
        private readonly IEmployeeRepository _repo;
        private readonly IEmployeeLeaveAllocationRepository _allocationRepo;
        private readonly ILeaveTypeRepository _leaveTypeRepo;
        private readonly IUserRepository _userRepo;
        private readonly PasswordHasher<User> _passwordHasher = new();
        private const string DefaultPassword = "Passw0rd!";
        private readonly IMapper _mapper;
        private readonly ILogger<EmployeeService> _logger;
        private static readonly IReadOnlyDictionary<string, int> DefaultLeaveAllocations =
            new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
            {
                ["CL"] = 8,              // Casual Leave
                ["SL"] = 10,             // Sick Leave
                ["EL"] = 15,             // Earned Leave
                ["Floater"] = 3,         // Floater Leave
                ["Comp Off"] = 15,       // Compensatory Off
                ["Maternity"] = 26 * 7,  // Maternity Leave (26 weeks = 182 days)
                ["Paternity"] = 14       // Paternity Leave
            };

        public EmployeeService(
            IEmployeeRepository repo,
            IEmployeeLeaveAllocationRepository allocationRepo,
            ILeaveTypeRepository leaveTypeRepo,
            IUserRepository userRepo,
            IMapper mapper,
            ILogger<EmployeeService> logger)
        {
            _repo = repo;
            _allocationRepo = allocationRepo;
            _leaveTypeRepo = leaveTypeRepo;
            _userRepo = userRepo;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<EmployeeDto> CreateAsync(CreateEmployeeRequest request)
        {
            var exists = await _repo.GetByWorkEmailAsync(request.WorkEmail);
            if (exists != null)
                throw new Exception("Employee with this email already exists.");
            
            if (request.ManagerId.HasValue)
            {
                var manager = await _userRepo.GetByIdAsync(request.ManagerId.Value);
                if (manager == null)
                {
                    throw new ArgumentException($"Manager with ID '{request.ManagerId.Value}' not found. Please provide a valid ManagerId.", nameof(request.ManagerId));
                }
            }

            var employee = _mapper.Map<Employee>(request);
            employee.Id = Guid.NewGuid();

            await _repo.AddAsync(employee);
            await _repo.SaveChangesAsync();
            await EnsureUserAccountAsync(employee);
            await AllocateDefaultLeavesAsync(employee);

            return _mapper.Map<EmployeeDto>(employee);
        }

        public async Task DeleteAsync(Guid id)
        {
            var emp = await _repo.GetByIdAsync(id);
            if (emp == null)
                throw new KeyNotFoundException("Employee not found.");

            await _repo.DeleteAsync(emp);
            await _repo.SaveChangesAsync();
        }

        public async Task<EmployeeDto?> GetByIdAsync(Guid id)
        {
            var emp = await _repo.GetByIdAsync(id);
            if (emp != null)
            {
                _logger.LogInformation($"Employee fetched: {emp.Id}, Dept: {emp.Department != null}, Desig: {emp.Designation != null}, Mgr: {emp.Manager != null}, Loc: {emp.Location != null}");
            }
            return emp == null ? null : _mapper.Map<EmployeeDto>(emp);
        }

        public async Task<IEnumerable<EmployeeDto>> GetByDepartmentIdAsync(Guid departmentId)
        {
            var employees = await _repo.GetByDepartmentIdAsync(departmentId);
            return _mapper.Map<IEnumerable<EmployeeDto>>(employees);
        }

 

        public async Task<(IEnumerable<EmployeeDto> Items, int Total)> SearchAsync(
            EmployeeSearchParams searchParams)
        {
            var (items, total) = await _repo.SearchAsync(
                searchParams.Query,
                searchParams.DepartmentId,
                searchParams.DesignationId,
                searchParams.ManagerId,
                searchParams.LocationId,
                searchParams.EmploymentType,
                searchParams.Page,
                searchParams.PageSize,
                searchParams.SortBy,
                searchParams.SortDesc
            );

            return (_mapper.Map<IEnumerable<EmployeeDto>>(items), total);
        }

        public async Task<EmployeeDto> UpdateAsync(Guid id, UpdateEmployeeRequest request)
        {
            var emp = await _repo.GetByIdAsync(id);
            if (emp == null)
                throw new KeyNotFoundException("Employee not found.");

            _mapper.Map(request, emp);

            await _repo.UpdateAsync(emp);
            await _repo.SaveChangesAsync();

            return _mapper.Map<EmployeeDto>(emp);
        }

        public async Task<IEnumerable<ManagerDto>> GetManagersAsync()
        {
            return await _repo.GetManagersAsync();
        }

        private async Task AllocateDefaultLeavesAsync(Employee employee)
        {
            var currentYear = DateTime.UtcNow.Year;
            var leaveTypes = await _leaveTypeRepo.GetAllAsync();

            var allocationsToCreate = leaveTypes
                .Where(type => DefaultLeaveAllocations.ContainsKey(type.Code))
                .Select(type => new EmployeeLeaveAllocation
                {
                    EmployeeId = employee.Id,
                    LeaveTypeId = type.Id,
                    Year = currentYear,
                    RemainingDays = DefaultLeaveAllocations[type.Code]
                })
                .ToList();

            if (!allocationsToCreate.Any())
                return;

            await _allocationRepo.AddRangeAsync(allocationsToCreate);
            await _allocationRepo.SaveChangesAsync();
        }

        private async Task EnsureUserAccountAsync(Employee employee)
        {
            var existingUser = await _userRepo.GetByEmailAsync(employee.WorkEmail);
            if (existingUser != null)
                return;

            var fullName = string.Join(" ", new[]
            {
                employee.FirstName,
                employee.LastName
            }.Where(part => !string.IsNullOrWhiteSpace(part))).Trim();

            if (string.IsNullOrWhiteSpace(fullName))
                fullName = employee.WorkEmail;

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = employee.WorkEmail,
                FullName = string.IsNullOrWhiteSpace(employee.DisplayName)
                    ? fullName
                    : employee.DisplayName!,
                Role = "Employee"
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, DefaultPassword);

            await _userRepo.AddAsync(user);
            await _userRepo.SaveChangesAsync();
        }

        public async Task<IEnumerable<EmployeeAnniversaryDto>> GetTodayAnniversariesAsync()
        {
            var today = DateTime.Today;
            var allEmployees = await _repo.GetAllAsync();

            var anniversaryEmployees = allEmployees
                .Where(emp =>
                {
                    var joiningDate = emp.JoiningDate.Date;
                    // Check if today is the anniversary (same month and day)
                    if (joiningDate.Month != today.Month || joiningDate.Day != today.Day)
                        return false;

                    // Calculate years completed
                    var yearsCompleted = today.Year - joiningDate.Year;

                    // Must have completed at least 1 year
                    return yearsCompleted >= 1;
                })
                .Select(emp =>
                {
                    var joiningDate = emp.JoiningDate.Date;
                    var yearsCompleted = today.Year - joiningDate.Year;

                    // Generate anniversary message based on years
                    string message;
                    if (yearsCompleted == 1)
                        message = "First Anniversary";
                    else if (yearsCompleted == 2)
                        message = "Second Anniversary";
                    else if (yearsCompleted == 3)
                        message = "Third Anniversary";
                    else
                        message = $"{yearsCompleted}th Anniversary";

                    return new EmployeeAnniversaryDto
                    {
                        Id = emp.Id,
                        EmployeeCode = emp.EmployeeCode,
                        FirstName = emp.FirstName,
                        LastName = emp.LastName,
                        DisplayName = emp.DisplayName,
                        WorkEmail = emp.WorkEmail,
                        JoiningDate = emp.JoiningDate,
                        YearsCompleted = yearsCompleted,
                        AnniversaryMessage = message,
                        DepartmentName = emp.Department?.Name,
                        DesignationTitle = emp.Designation?.Title
                    };
                })
                .OrderBy(emp => emp.YearsCompleted)
                .ToList();

            return anniversaryEmployees;
        }

        public async Task<IEnumerable<EmployeeAnniversaryDto>> GetUpcomingAnniversariesAsync(int daysAhead = 15)
        {
            var today = DateTime.Today;
            var endDate = today.AddDays(daysAhead);
            var allEmployees = await _repo.GetAllAsync();
            var upcomingAnniversaries = allEmployees
                .Where(emp =>
                {
                    var joiningDate = emp.JoiningDate.Date;
                    var yearsCompleted = today.Year - joiningDate.Year;
                    if (yearsCompleted < 1)
                        return false;
                    var thisYearAnniversary = new DateTime(today.Year, joiningDate.Month, joiningDate.Day);
                    return thisYearAnniversary > today && thisYearAnniversary <= endDate;
                })
                .Select(emp =>
                {
                    var joiningDate = emp.JoiningDate.Date;
                    var yearsCompleted = today.Year - joiningDate.Year;
                    var thisYearAnniversary = new DateTime(today.Year, joiningDate.Month, joiningDate.Day);
                    string message;
                    if (yearsCompleted == 1)
                        message = "First Anniversary";
                    else if (yearsCompleted == 2)
                        message = "Second Anniversary";
                    else if (yearsCompleted == 3)
                        message = "Third Anniversary";
                    else
                        message = $"{yearsCompleted}th Anniversary";

                    return new EmployeeAnniversaryDto
                    {
                        Id = emp.Id,
                        EmployeeCode = emp.EmployeeCode,
                        FirstName = emp.FirstName,
                        LastName = emp.LastName,
                        DisplayName = emp.DisplayName,
                        WorkEmail = emp.WorkEmail,
                        JoiningDate = emp.JoiningDate,
                        YearsCompleted = yearsCompleted,
                        AnniversaryMessage = message,
                        DepartmentName = emp.Department?.Name,
                        DesignationTitle = emp.Designation?.Title
                    };
                })
                .OrderBy(emp => new DateTime(today.Year, emp.JoiningDate.Month, emp.JoiningDate.Day))
                .ToList();
                Console.WriteLine("Upcoming Anniversaries: " + upcomingAnniversaries.Count);
            return upcomingAnniversaries;
        }

        public async Task<IEnumerable<EmployeeDto>> GetNewJoineesAsync(int daysBack = 30)
        {
            var today = DateTime.Today;
            var cutoffDate = today.AddDays(-daysBack);
            var allEmployees = await _repo.GetAllAsync();

            var newJoinees = allEmployees
                .Where(emp => emp.JoiningDate.Date >= cutoffDate && emp.JoiningDate.Date <= today)
                .OrderByDescending(emp => emp.JoiningDate)
                .ToList();


            return _mapper.Map<IEnumerable<EmployeeDto>>(newJoinees);
        }

        public async Task<IEnumerable<EmployeeDto>> GetByTeamIdAsync(Guid teamId)
        {
            var employees = await _repo.GetByTeamIdAsync(teamId);
            return _mapper.Map<IEnumerable<EmployeeDto>>(employees);
        }

        public async Task<EmployeeDto> AssignToTeamAsync(Guid employeeId, Guid teamId)
        {
            var employee = await _repo.GetByIdAsync(employeeId);
            if (employee == null)
                throw new Exception("Employee not found.");

            // Note: We're not validating if the team exists here
            // The database foreign key constraint will handle that
            employee.TeamId = teamId;

            await _repo.UpdateAsync(employee);
            await _repo.SaveChangesAsync();

            return _mapper.Map<EmployeeDto>(employee);
        }
    }
}
