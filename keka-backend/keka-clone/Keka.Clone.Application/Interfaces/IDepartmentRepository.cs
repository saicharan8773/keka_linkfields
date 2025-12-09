using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Interfaces;

public interface IDepartmentRepository
{
    Task<IEnumerable<Department>> GetAllAsync();
    Task<Department?> GetByIdAsync(Guid id);
    Task<Department?> GetByCodeAsync(string code);
    Task<Department?> GetByNameAsync(string name);
    Task AddAsync(Department department);
    Task SaveChangesAsync();
}