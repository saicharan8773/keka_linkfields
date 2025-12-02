using Keka.Clone.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Keka.Clone.Persistence.Configurations;

public class EmployeeConfiguration:IEntityTypeConfiguration<Employee>
{
    public void Configure(EntityTypeBuilder<Employee> builder)
    {
        builder.HasIndex(e => e.EmployeeCode).IsUnique();
        builder.HasIndex(e => e.WorkEmail).IsUnique();

        builder.Property(e => e.FirstName).HasMaxLength(100).IsRequired();
        builder.Property(e => e.LastName).HasMaxLength(100).IsRequired();
        builder.Property(e => e.EmployeeCode).HasMaxLength(50).IsRequired();
        builder.Property(e => e.WorkEmail).HasMaxLength(450).IsRequired();
        builder.Property(e => e.PersonalEmail).HasMaxLength(450);
        builder.Property(e => e.MobileNumber).HasMaxLength(30);
        builder.Property(e => e.WorkNumber).HasMaxLength(30);
        builder.Property(e => e.ResidenceNumber).HasMaxLength(30);
        builder.Property(e => e.DisplayName).HasMaxLength(150);
        builder.Property(e => e.JobTitlePrimary).HasMaxLength(150);
        builder.Property(e => e.JobTitleSecondary).HasMaxLength(150);
        builder.Property(e => e.BusinessUnit).HasMaxLength(150);
        builder.Property(e => e.CostCenter).HasMaxLength(150);
        builder.Property(e => e.LegalEntity).HasMaxLength(200);
        builder.Property(e => e.DepartmentPath).HasMaxLength(250);

        builder.HasOne(e => e.Manager)
            .WithMany(m => m.DirectReports)
            .HasForeignKey(e => e.ManagerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Department)
            .WithMany(d => d.Employees)
            .HasForeignKey(e => e.DepartmentId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(e => e.Designation)
            .WithMany(d => d.Employees)
            .HasForeignKey(e => e.DesignationId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(e => e.SalaryStructure)
            .WithMany(s => s.Employees)
            .HasForeignKey(e => e.SalaryStructureId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(e => e.Location)
            .WithMany(l => l.Employees)
            .HasForeignKey(e => e.LocationId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Property(e => e.CustomFieldsJson).HasColumnType("nvarchar(max)");
        builder.Property(e => e.DisableAttendanceTracking).HasDefaultValue(false);
    }
}
