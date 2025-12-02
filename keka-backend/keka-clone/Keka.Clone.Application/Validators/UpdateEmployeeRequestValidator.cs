using FluentValidation;
using Keka.Clone.Application.DTOs.Employee;

namespace Keka.Clone.Application.Validators;

public class UpdateEmployeeRequestValidator:AbstractValidator<UpdateEmployeeRequest>
{
    public UpdateEmployeeRequestValidator()
    {
        RuleFor(x => x.FirstName).MaximumLength(100).When(x => x.FirstName != null);
        RuleFor(x => x.MiddleName).MaximumLength(100).When(x => x.MiddleName != null);
        RuleFor(x => x.LastName).MaximumLength(100).When(x => x.LastName != null);
        RuleFor(x => x.WorkEmail).EmailAddress().When(x => x.WorkEmail != null);
        RuleFor(x => x.PersonalEmail).EmailAddress().When(x => x.PersonalEmail != null);
        RuleFor(x => x.MobileNumber).MaximumLength(30).When(x => x.MobileNumber != null);
        RuleFor(x => x.WorkNumber).MaximumLength(30).When(x => x.WorkNumber != null);
        RuleFor(x => x.ResidenceNumber).MaximumLength(30).When(x => x.ResidenceNumber != null);
    }
}
