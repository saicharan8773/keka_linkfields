using FluentValidation;
using Keka.Clone.Application.DTOs.Employee;

namespace Keka.Clone.Application.Validators;

public class UpdateEmployeeRequestValidator:AbstractValidator<UpdateEmployeeRequest>
{
    public UpdateEmployeeRequestValidator()
    {
        RuleFor(x => x.FirstName).MaximumLength(100).When(x => x.FirstName != null);
        RuleFor(x => x.LastName).MaximumLength(100).When(x => x.LastName != null);
        RuleFor(x => x.WorkEmail).EmailAddress().When(x => x.WorkEmail != null);
        RuleFor(x => x.MobileNumber).MaximumLength(30).When(x => x.MobileNumber != null);
    }
}
