using Keka.Clone.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Keka.Clone.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

        public DbSet<Employee> Employees => Set<Employee>();
        public DbSet<Department> Departments => Set<Department>();
        public DbSet<Designation> Designations => Set<Designation>();
        public DbSet<Location> Locations => Set<Location>();
        public DbSet<SalaryStructure> SalaryStructures => Set<SalaryStructure>();

        public DbSet<LeaveType> LeaveTypes => Set<LeaveType>();
        public DbSet<EmployeeLeaveAllocation> EmployeeLeaveAllocations => Set<EmployeeLeaveAllocation>();
        public DbSet<LeaveRequest> LeaveRequests => Set<LeaveRequest>();
        public DbSet<Attendance> Attendances => Set<Attendance>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Apply entity configurations from this assembly
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

            // -------------------------
            // LEAVE RELATIONSHIPS
            // -------------------------
            modelBuilder.Entity<LeaveRequest>()
                .HasOne(l => l.Employee)
                .WithMany(e => e.LeaveRequests)
                .HasForeignKey(l => l.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<LeaveRequest>()
                .HasOne(l => l.LeaveType)
                .WithMany()
                .HasForeignKey(l => l.LeaveTypeId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<SalaryStructure>(entity =>
            {
                entity.Property(x => x.Basic).HasPrecision(18, 2);
                entity.Property(x => x.HRA).HasPrecision(18, 2);
                entity.Property(x => x.OtherAllowances).HasPrecision(18, 2);
                entity.Property(x => x.Deductions).HasPrecision(18, 2);
            });

            modelBuilder.Entity<EmployeeLeaveAllocation>()
                .HasOne(a => a.Employee)
                .WithMany(e => e.LeaveAllocations)
                .HasForeignKey(a => a.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed default leave types
            modelBuilder.Entity<LeaveType>().HasData(
                new LeaveType { Id = 1, Code = "CL", Name = "Casual Leave", DefaultDays = 8, IsUnlimited = false },
                new LeaveType { Id = 2, Code = "Comp Off", Name = "Compensatory Off", DefaultDays = 15, IsUnlimited = false },
                new LeaveType { Id = 3, Code = "EL", Name = "Earned Leave", DefaultDays = 15, IsUnlimited = false },
                new LeaveType { Id = 4, Code = "Floater", Name = "Floater Leave", DefaultDays = 3, IsUnlimited = false },
                new LeaveType { Id = 5, Code = "LOP", Name = "LOP", DefaultDays = 0, IsUnlimited = true },
                new LeaveType { Id = 6, Code = "Maternity", Name = "Maternity Leave", DefaultDays = 26 * 7, IsUnlimited = false },
                new LeaveType { Id = 7, Code = "SL", Name = "Sick Leave", DefaultDays = 10, IsUnlimited = false },
                new LeaveType { Id = 8, Code = "Paternity", Name = "Paternity Leave", DefaultDays = 14, IsUnlimited = false }
            );
            
            base.OnModelCreating(modelBuilder);
        }
    }
}
