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
    Task<DesignationDto> CreateAsync(CreateDesignationRequest request);
}