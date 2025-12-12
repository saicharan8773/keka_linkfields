using Keka.Clone.Application.DTOs.Employee;

namespace Keka.Clone.Application.Interfaces;

public interface IEmployeeService
{
    Task<(IEnumerable<EmployeeDto> Items, int Total)> SearchAsync(EmployeeSearchParams searchParams);
    Task<IEnumerable<EmployeeDto>> GetByDepartmentIdAsync(Guid departmentId);
    Task<EmployeeDto?> GetByIdAsync(Guid id);
    Task<EmployeeDto> CreateAsync(CreateEmployeeRequest request);
    Task<EmployeeDto> UpdateAsync(Guid id, UpdateEmployeeRequest request);
    Task DeleteAsync(Guid id);
    Task<IEnumerable<ManagerDto>> GetManagersAsync();
    Task<IEnumerable<EmployeeAnniversaryDto>> GetTodayAnniversariesAsync();
    Task<IEnumerable<EmployeeAnniversaryDto>> GetUpcomingAnniversariesAsync(int daysAhead = 15);
    Task<IEnumerable<EmployeeDto>> GetNewJoineesAsync(int daysBack = 30);
}
