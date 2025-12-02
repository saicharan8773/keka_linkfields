using Keka.Clone.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Keka.Clone.Persistence.Repositories;
using Keka.Clone.Application.Interfaces;

namespace Keka.Clone.Persistence.Repositories;


public class EmployeeRepository:IEmployeeRepository
{
    private readonly AppDbContext _db;

    public EmployeeRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(Employee employee)
    {
        await _db.Employees.AddAsync(employee);
    }
    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Employee employee)
    {
        _db.Employees.Remove(employee);
    }

    public async Task<Employee?> GetByWorkEmailAsync(string email)
    {
        return await _db.Employees.FirstOrDefaultAsync(e => e.WorkEmail == email);
    }

    public async Task<Employee?> GetByIdAsync(Guid id)
    {
        return await _db.Employees
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .Include(e => e.SalaryStructure)
            .Include(e => e.Manager)
            .ThenInclude(m => m.Manager)
            .Include(e => e.Location)
            .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task UpdateAsync(Employee employee)
    {
        _db.Employees.Update(employee);
    }

    public async Task<(IEnumerable<Employee> Items, int Total)> SearchAsync(
        string? query,
        Guid? departmentId,
        Guid? designationId,
        Guid? managerId,
        int page,
        int pageSize,
        string? sortBy,
        bool sortDesc)
    {
        var q = _db.Employees.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query))
        {
            var qLower = query.Trim().ToLower();
            q = q.Where(e =>
                e.EmployeeCode.ToLower().Contains(qLower) ||
                e.FirstName.ToLower().Contains(qLower) ||
                e.LastName.ToLower().Contains(qLower) ||
                e.WorkEmail.ToLower().Contains(qLower) ||
                (e.MobileNumber ?? string.Empty).ToLower().Contains(qLower));
        }

        if (departmentId.HasValue) q = q.Where(e => e.DepartmentId == departmentId);
        if (designationId.HasValue) q = q.Where(e => e.DesignationId == designationId);
        if (managerId.HasValue) q = q.Where(e => e.ManagerId == managerId);

        var total = await q.CountAsync();

        // Sorting
        if (!string.IsNullOrWhiteSpace(sortBy))
        {
            if (sortBy.Equals("firstname", StringComparison.OrdinalIgnoreCase))
                q = sortDesc ? q.OrderByDescending(e => e.FirstName) : q.OrderBy(e => e.FirstName);
            else if (sortBy.Equals("joiningdate", StringComparison.OrdinalIgnoreCase))
                q = sortDesc ? q.OrderByDescending(e => e.JoiningDate) : q.OrderBy(e => e.JoiningDate);
            else
                q = q.OrderBy(e => e.EmployeeCode);
        }
        else
        {
            q = q.OrderBy(e => e.EmployeeCode);
        }

        var items = await q
            .Include(e => e.Department)
            .Include(e => e.Manager)
            .ThenInclude(m => m.Manager)
            .Include(e => e.Location)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        //Task SaveChangesAsync();

        return (items, total);
    }
}
