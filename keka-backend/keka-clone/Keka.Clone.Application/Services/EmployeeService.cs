using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Keka.Clone.Application.DTOs.Employee;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;
using Microsoft.AspNetCore.Identity;

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
            IMapper mapper)
        {
            _repo = repo;
            _allocationRepo = allocationRepo;
            _leaveTypeRepo = leaveTypeRepo;
            _userRepo = userRepo;
            _mapper = mapper;
        }

        public async Task<EmployeeDto> CreateAsync(CreateEmployeeRequest request)
        {
            var exists = await _repo.GetByWorkEmailAsync(request.WorkEmail);
            if (exists != null)
                throw new Exception("Employee with this email already exists.");

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
    }
}
