using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Interfaces;

public interface ISalaryStructureRepository
{
    Task<IEnumerable<SalaryStructure>> GetAllAsync();
    Task AddAsync(SalaryStructure salaryStructure);
    Task SaveChangesAsync();
}