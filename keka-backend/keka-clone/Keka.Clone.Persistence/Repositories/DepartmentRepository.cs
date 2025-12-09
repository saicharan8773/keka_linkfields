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

    public async Task<Department?> GetByCodeExcludingIdAsync(string code, Guid excludeId)
    {
        return await _db.Departments.FirstOrDefaultAsync(d => d.Code == code && d.Id != excludeId);
    }

    public async Task<Department?> GetByNameExcludingIdAsync(string name, Guid excludeId)
    {
        return await _db.Departments.FirstOrDefaultAsync(d => d.Name == name && d.Id != excludeId);
    }

    public async Task AddAsync(Department department)
    {
        await _db.Departments.AddAsync(department);
    }

    public void Update(Department department)
    {
        _db.Departments.Update(department);
    }

    public void Delete(Department department)
    {
        _db.Departments.Remove(department);
    }

    public async Task<bool> DeleteWithCascadeAsync(Guid id)
    {
        var department = await _db.Departments.FindAsync(id);
        if (department == null)
            return false;

        // Use transaction to ensure all operations succeed or fail together
        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            // Step 1: Get all designation IDs that belong to this department
            var designationIds = await _db.Designations
                .Where(d => d.DepartmentId == id)
                .Select(d => d.Id)
                .ToListAsync();

            // Step 2: Set DesignationId to NULL for all employees with designations from this department
            if (designationIds.Any())
            {
                await _db.Employees
                    .Where(e => e.DesignationId.HasValue && designationIds.Contains(e.DesignationId.Value))
                    .ExecuteUpdateAsync(s => s.SetProperty(e => e.DesignationId, (Guid?)null));
            }

            // Step 3: Set all employees' DepartmentId to NULL
            await _db.Employees
                .Where(e => e.DepartmentId == id)
                .ExecuteUpdateAsync(s => s.SetProperty(e => e.DepartmentId, (Guid?)null));

            // Step 4: Delete all designations linked to this department
            await _db.Designations
                .Where(d => d.DepartmentId == id)
                .ExecuteDeleteAsync();

            // Step 5: Delete the department itself
            _db.Departments.Remove(department);
            await _db.SaveChangesAsync();

            // Commit transaction
            await transaction.CommitAsync();
            return true;
        }
        catch (Exception)
        {
            // Rollback on any error
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }
}