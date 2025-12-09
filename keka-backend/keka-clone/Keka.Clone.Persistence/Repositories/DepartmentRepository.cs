using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Keka.Clone.Persistence.Repositories;

public class DepartmentRepository:IDepartmentRepository
{
    private readonly AppDbContext _db;
    public DepartmentRepository(AppDbContext db) => _db = db;

    public async Task<IEnumerable<Department>> GetAllAsync()
    {
        return await _db.Departments.Include(d => d.Employees).ToListAsync();
    }

    public async Task<Department?> GetByIdAsync(Guid id)
    {
        return await _db.Departments.FindAsync(id);
    }

    public async Task<Department?> GetByCodeAsync(string code)
    {
        return await _db.Departments.FirstOrDefaultAsync(d => d.Code == code);
    }

    public async Task<Department?> GetByNameAsync(string name)
    {
        return await _db.Departments.FirstOrDefaultAsync(d => d.Name == name);
    }

    public async Task AddAsync(Department department)
    {
        await _db.Departments.AddAsync(department);
    }

    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }
}