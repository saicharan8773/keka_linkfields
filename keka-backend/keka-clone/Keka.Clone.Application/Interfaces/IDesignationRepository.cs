using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Keka.Clone.Application.DTOs.Department;
using Keka.Clone.Application.DTOs.Designation;
using Keka.Clone.Domain.Entities;

namespace Keka.Clone.Application.Interfaces;

public interface IDesignationRepository
{
    Task<IEnumerable<Designation>> GetAllAsync();
    Task<Designation?> GetByIdAsync(Guid id);
    Task AddAsync(Designation designation);
    void Delete(Designation designation);
    Task<IEnumerable<Designation>> GetByDepartmentIdAsync(Guid departmentId);
    Task<IEnumerable<Employee>> GetByDesignationIdAsync(Guid designationId);    
    Task SaveChangesAsync();
}