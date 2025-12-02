using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Keka.Clone.Application.Interfaces;
using Keka.Clone.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Keka.Clone.Persistence.Repositories;

public class SalaryStructureRepository:ISalaryStructureRepository
{
    private readonly AppDbContext _db;
    public SalaryStructureRepository(AppDbContext db) => _db = db;

    public async Task<IEnumerable<SalaryStructure>> GetAllAsync()
    {
        return await _db.SalaryStructures.ToListAsync();
    }

    public async Task AddAsync(SalaryStructure salary)
    {
        await _db.SalaryStructures.AddAsync(salary);
    }

    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }
}