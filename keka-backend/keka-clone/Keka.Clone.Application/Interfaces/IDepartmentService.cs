using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Keka.Clone.Application.DTOs.Department;

namespace Keka.Clone.Application.Interfaces;

public interface IDepartmentService
{
    Task<IEnumerable<DepartmentDto>> GetAllAsync();
    Task<DepartmentDto> CreateAsync(CreateDepartmentRequest request);
}