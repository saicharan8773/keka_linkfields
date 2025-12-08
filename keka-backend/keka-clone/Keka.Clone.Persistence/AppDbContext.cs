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
            modelBuilder.Entity<SalaryStructure>(entity =>
            {
                entity.Property(x => x.Basic).HasPrecision(18, 2);
                entity.Property(x => x.HRA).HasPrecision(18, 2);
                entity.Property(x => x.OtherAllowances).HasPrecision(18, 2);
                entity.Property(x => x.Deductions).HasPrecision(18, 2);
            });
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

            // Seed Salary Structures
            modelBuilder.Entity<SalaryStructure>().HasData(
                new SalaryStructure { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Title = "L1", Description = "Level 1 - Top Tier", Basic = 100000, HRA = 50000, OtherAllowances = 20000, Deductions = 10000 },
                new SalaryStructure { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Title = "L2", Description = "Level 2", Basic = 80000, HRA = 40000, OtherAllowances = 15000, Deductions = 8000 },
                new SalaryStructure { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Title = "L3", Description = "Level 3", Basic = 60000, HRA = 30000, OtherAllowances = 10000, Deductions = 6000 },
                new SalaryStructure { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Title = "C1", Description = "Consultant 1", Basic = 50000, HRA = 25000, OtherAllowances = 8000, Deductions = 5000 },
                new SalaryStructure { Id = Guid.Parse("55555555-5555-5555-5555-555555555555"), Title = "C2", Description = "Consultant 2", Basic = 40000, HRA = 20000, OtherAllowances = 6000, Deductions = 4000 },
                new SalaryStructure { Id = Guid.Parse("66666666-6666-6666-6666-666666666666"), Title = "C3", Description = "Consultant 3", Basic = 30000, HRA = 15000, OtherAllowances = 5000, Deductions = 3000 },
                new SalaryStructure { Id = Guid.Parse("77777777-7777-7777-7777-777777777777"), Title = "M1", Description = "Manager 1", Basic = 90000, HRA = 45000, OtherAllowances = 18000, Deductions = 9000 },
                new SalaryStructure { Id = Guid.Parse("88888888-8888-8888-8888-888888888888"), Title = "M2", Description = "Manager 2", Basic = 70000, HRA = 35000, OtherAllowances = 12000, Deductions = 7000 },
                new SalaryStructure { Id = Guid.Parse("99999999-9999-9999-9999-999999999999"), Title = "E1", Description = "Entry Level 1", Basic = 20000, HRA = 10000, OtherAllowances = 2000, Deductions = 2000 },
                new SalaryStructure { Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), Title = "E2", Description = "Entry Level 2", Basic = 15000, HRA = 7500, OtherAllowances = 1000, Deductions = 1500 }
            );

            // Seed Departments
            modelBuilder.Entity<Department>().HasData(
                new Department { Id = Guid.Parse("d1000000-0000-0000-0000-000000000001"), Name = "Human Resources", Code = "HR" },
                new Department { Id = Guid.Parse("d1000000-0000-0000-0000-000000000002"), Name = "Financial Accounting", Code = "FA" },
                new Department { Id = Guid.Parse("d1000000-0000-0000-0000-000000000003"), Name = "Marketing and Sales", Code = "M&S" },
                new Department { Id = Guid.Parse("d1000000-0000-0000-0000-000000000004"), Name = "Operations management", Code = "OM" },
                new Department { Id = Guid.Parse("d1000000-0000-0000-0000-000000000005"), Name = "Research and development", Code = "R&D" },
                new Department { Id = Guid.Parse("d1000000-0000-0000-0000-000000000006"), Name = "Customer service", Code = "CS" },
                new Department { Id = Guid.Parse("d1000000-0000-0000-0000-000000000007"), Name = "Information Technology", Code = "IT" },
                new Department { Id = Guid.Parse("d1000000-0000-0000-0000-000000000008"), Name = "IT Support", Code = "ITS" }
            );

            // Seed Designations
            modelBuilder.Entity<Designation>().HasData(
                // HR
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000001"), Title = "HR Executive", Description = "HR Executive", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000001") },
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000002"), Title = "HR Manager", Description = "HR Manager", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000001") },
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000003"), Title = "Talent Acquisition Specialist", Description = "Talent Acquisition Specialist", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000001") },
                
                // FA
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000004"), Title = "Accountant", Description = "Accountant", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000002") },
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000005"), Title = "Senior Accounts Manager", Description = "Senior Accounts Manager", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000002") },
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000006"), Title = "Financial Analyst", Description = "Financial Analyst", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000002") },

                // M&S
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000007"), Title = "Sales Executive", Description = "Sales Executive", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000003") },
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000008"), Title = "Marketing Manager", Description = "Marketing Manager", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000003") },
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000009"), Title = "Business Development Executive", Description = "Business Development Executive", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000003") },

                // OM
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000010"), Title = "Operations Manager", Description = "Operations Manager", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000004") },
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000011"), Title = "Supply Chain Coordinator", Description = "Supply Chain Coordinator", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000004") },
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000012"), Title = "Production Supervisor", Description = "Production Supervisor", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000004") },

                // R&D
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000013"), Title = "R&D Engineer", Description = "R&D Engineer", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000005") },
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000014"), Title = "Research Scientist", Description = "Research Scientist", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000005") },
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000015"), Title = "Product Development Specialist", Description = "Product Development Specialist", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000005") },

                // CS
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000016"), Title = "Customer Support Executive", Description = "Customer Support Executive", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000006") },
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000017"), Title = "Customer Success Manager", Description = "Customer Success Manager", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000006") },
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000018"), Title = "Call Center Representative", Description = "Call Center Representative", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000006") },

                // IT
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000019"), Title = "Software Developer", Description = "Software Developer", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000007") },
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000020"), Title = "IT Administrator", Description = "IT Administrator", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000007") },
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000021"), Title = "Systems Analyst", Description = "Systems Analyst", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000007") },

                // ITS
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000022"), Title = "IT Support Technician", Description = "IT Support Technician", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000008") },
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000023"), Title = "Help Desk Specialist", Description = "Help Desk Specialist", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000008") },
                new Designation { Id = Guid.Parse("de000000-0000-0000-0000-000000000024"), Title = "Desktop Support Engineer", Description = "Desktop Support Engineer", DepartmentId = Guid.Parse("d1000000-0000-0000-0000-000000000008") }
            );
            
            base.OnModelCreating(modelBuilder);
        }
    }
}
