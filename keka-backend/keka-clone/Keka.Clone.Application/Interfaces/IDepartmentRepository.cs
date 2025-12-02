using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Interfaces;

public interface IDepartmentRepository
{
    Task<IEnumerable<Department>> GetAllAsync();
    Task AddAsync(Department department);
    Task SaveChangesAsync();
}