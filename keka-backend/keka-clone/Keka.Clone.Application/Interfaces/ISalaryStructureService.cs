using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Keka.Clone.Application.DTOs.Salary;

namespace Keka.Clone.Application.Interfaces;

public interface ISalaryStructureService
{
    Task<IEnumerable<SalaryStructureDto>> GetAllAsync();
    Task<SalaryStructureDto> CreateAsync(CreateSalaryStructureRequest request);
}