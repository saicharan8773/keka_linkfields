using Keka.Clone.Application.DTOs.Employee;

namespace Keka.Clone.Application.Interfaces;

public interface IEmployeeService
{
    Task<(IEnumerable<EmployeeDto> Items, int Total)> SearchAsync(EmployeeSearchParams searchParams);
    Task<EmployeeDto?> GetByIdAsync(Guid id);
    Task<EmployeeDto> CreateAsync(CreateEmployeeRequest request);
    Task<EmployeeDto> UpdateAsync(Guid id, UpdateEmployeeRequest request);
    Task DeleteAsync(Guid id);
}
