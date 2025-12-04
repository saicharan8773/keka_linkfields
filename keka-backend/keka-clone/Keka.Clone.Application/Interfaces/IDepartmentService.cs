using Keka.Clone.Application.DTOs.Department;

namespace Keka.Clone.Application.Interfaces;

public interface IDepartmentService
{
    Task<IEnumerable<DepartmentDto>> GetAllAsync();
    Task<DepartmentDto?> GetByIdAsync(Guid id);
    Task<DepartmentDto> CreateAsync(CreateDepartmentRequest request);
}