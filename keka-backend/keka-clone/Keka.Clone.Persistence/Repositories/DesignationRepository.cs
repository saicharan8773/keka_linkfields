using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Keka.Clone.Persistence.Repositories;

public class DesignationRepository:IDesignationRepository
{
    private readonly AppDbContext _db;
    public DesignationRepository(AppDbContext db) => _db = db;

    public async Task<IEnumerable<Designation>> GetAllAsync()
    {
        return await _db.Designations.Include(d => d.Department).ToListAsync();
    }

    public async Task AddAsync(Designation designation)
    {
        await _db.Designations.AddAsync(designation);
    }

    public async Task<IEnumerable<Designation>> GetByDepartmentIdAsync(Guid departmentId)
    {
        return await _db.Designations
            .Include(d => d.Department)
            .Where(d => d.DepartmentId == departmentId)
            .ToListAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }
}