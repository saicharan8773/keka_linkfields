using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Interfaces;

public interface IDesignationRepository
{
    Task<IEnumerable<Designation>> GetAllAsync();
    Task AddAsync(Designation designation);
    Task<IEnumerable<Designation>> GetByDepartmentIdAsync(Guid departmentId);
    Task SaveChangesAsync();
}