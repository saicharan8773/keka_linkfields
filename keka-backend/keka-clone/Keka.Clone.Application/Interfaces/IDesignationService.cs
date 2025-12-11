using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Keka.Clone.Application.DTOs.Designation;

namespace Keka.Clone.Application.Interfaces;

public interface IDesignationService
{
    Task<IEnumerable<DesignationDto>> GetAllAsync();
    Task<DesignationDto> GetByIdAsync(Guid id);
    Task<DesignationDto> CreateAsync(CreateDesignationRequest request);
    Task DeleteAsync(Guid id);
    Task<DesignationDto> EditDesignationAsync(Guid id,Designationupdate designationDto);
    Task<IEnumerable<DesignationDto>> GetByDepartmentIdAsync(Guid departmentId);
    Task<IEnumerable<DesignationDto>> GetByDepartmentNameAsync(string name);
}