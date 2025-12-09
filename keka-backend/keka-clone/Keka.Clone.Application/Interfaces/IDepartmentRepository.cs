using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Interfaces;

public interface IDepartmentRepository
{
    Task<IEnumerable<Department>> GetAllAsync();
    Task<Department?> GetByIdAsync(Guid id);
    Task<Department?> GetByCodeAsync(string code);
    Task<Department?> GetByNameAsync(string name);
    Task<Department?> GetByCodeExcludingIdAsync(string code, Guid excludeId);
    Task<Department?> GetByNameExcludingIdAsync(string name, Guid excludeId);
    Task AddAsync(Department department);
    void Update(Department department);
    void Delete(Department department);
    Task<bool> DeleteWithCascadeAsync(Guid id);
    Task SaveChangesAsync();
}