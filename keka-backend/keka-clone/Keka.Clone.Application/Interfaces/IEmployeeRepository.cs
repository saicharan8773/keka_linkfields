using Keka.Clone.Application.DTOs.Employee;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<Employee?> GetByIdAsync(Guid id);
        Task<Employee?> GetByWorkEmailAsync(string email);
        Task AddAsync(Employee employee);
        Task UpdateAsync(Employee employee);
        Task DeleteAsync(Employee employee);

        Task<(IEnumerable<Employee> Items, int Total)> SearchAsync(
            string? query,
            Guid? departmentId,
            Guid? designationId,
            Guid? managerId,
            Guid? locationId,
            string? employmentType,
            int page,
            int pageSize,
            string? sortBy,
            bool sortDesc
        );

        Task<IEnumerable<Employee>> GetByDepartmentIdAsync(Guid departmentId);
        Task<IEnumerable<Employee>> GetByDesignationIdAsync(Guid designationId);
        Task<IEnumerable<Employee>> GetAllAsync();
        
        Task<IEnumerable<ManagerDto>> GetManagersAsync();
        Task<IEnumerable<Employee>> GetByTeamIdAsync(Guid teamId);

        Task SaveChangesAsync();
    }
}
