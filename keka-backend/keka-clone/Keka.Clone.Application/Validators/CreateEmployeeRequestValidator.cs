using FluentValidation;
using Keka.Clone.Application.DTOs.Employee;

namespace Keka.Clone.Application.Validators;

public class CreateEmployeeRequestValidator:AbstractValidator<CreateEmployeeRequest>
{
    public CreateEmployeeRequestValidator()
    {
        RuleFor(x => x.EmployeeCode).NotEmpty().MaximumLength(50);
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.WorkEmail).NotEmpty().EmailAddress();
        RuleFor(x => x.JoiningDate).NotEmpty();
    }
}
