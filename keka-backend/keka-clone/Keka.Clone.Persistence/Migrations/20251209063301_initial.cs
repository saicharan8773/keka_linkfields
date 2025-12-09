using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Keka.Clone.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Attendances",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LoginTimeUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LogoutTimeUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LoginLat = table.Column<double>(type: "float", nullable: true),
                    LoginLng = table.Column<double>(type: "float", nullable: true),
                    LogoutLat = table.Column<double>(type: "float", nullable: true),
                    LogoutLng = table.Column<double>(type: "float", nullable: true),
                    WorkedHours = table.Column<double>(type: "float", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attendances", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LeaveTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DefaultDays = table.Column<int>(type: "int", nullable: false),
                    IsUnlimited = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeaveTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Country = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SalaryStructures",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Basic = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    HRA = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    OtherAllowances = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Deductions = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalaryStructures", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Designations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DepartmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Designations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Designations_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsRevoked = table.Column<bool>(type: "bit", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EmployeeCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    WorkEmail = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    MobileNumber = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Nationality = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    JoiningDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DesignationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DepartmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ManagerId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LocationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    EmploymentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TimeType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SalaryStructureId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Employees_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Employees_Designations_DesignationId",
                        column: x => x.DesignationId,
                        principalTable: "Designations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Employees_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Employees_SalaryStructures_SalaryStructureId",
                        column: x => x.SalaryStructureId,
                        principalTable: "SalaryStructures",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Employees_Users_ManagerId",
                        column: x => x.ManagerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EmployeeLeaveAllocations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LeaveTypeId = table.Column<int>(type: "int", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    RemainingDays = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeLeaveAllocations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmployeeLeaveAllocations_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LeaveRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmployeeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LeaveTypeId = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    RequestedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActionDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeaveRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LeaveRequests_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LeaveRequests_LeaveTypes_LeaveTypeId",
                        column: x => x.LeaveTypeId,
                        principalTable: "LeaveTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Departments",
                columns: new[] { "Id", "Code", "Name" },
                values: new object[,]
                {
                    { new Guid("d1000000-0000-0000-0000-000000000001"), "HR", "Human Resources" },
                    { new Guid("d1000000-0000-0000-0000-000000000002"), "FA", "Financial Accounting" },
                    { new Guid("d1000000-0000-0000-0000-000000000003"), "M&S", "Marketing and Sales" },
                    { new Guid("d1000000-0000-0000-0000-000000000004"), "OM", "Operations management" },
                    { new Guid("d1000000-0000-0000-0000-000000000005"), "R&D", "Research and development" },
                    { new Guid("d1000000-0000-0000-0000-000000000006"), "CS", "Customer service" },
                    { new Guid("d1000000-0000-0000-0000-000000000007"), "IT", "Information Technology" },
                    { new Guid("d1000000-0000-0000-0000-000000000008"), "ITS", "IT Support" }
                });

            migrationBuilder.InsertData(
                table: "LeaveTypes",
                columns: new[] { "Id", "Code", "DefaultDays", "IsUnlimited", "Name" },
                values: new object[,]
                {
                    { 1, "CL", 8, false, "Casual Leave" },
                    { 2, "Comp Off", 15, false, "Compensatory Off" },
                    { 3, "EL", 15, false, "Earned Leave" },
                    { 4, "Floater", 3, false, "Floater Leave" },
                    { 5, "LOP", 0, true, "LOP" },
                    { 6, "Maternity", 182, false, "Maternity Leave" },
                    { 7, "SL", 10, false, "Sick Leave" },
                    { 8, "Paternity", 14, false, "Paternity Leave" }
                });

            migrationBuilder.InsertData(
                table: "SalaryStructures",
                columns: new[] { "Id", "Basic", "Deductions", "Description", "HRA", "OtherAllowances", "Title" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), 100000m, 10000m, "Level 1 - Top Tier", 50000m, 20000m, "L1" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), 80000m, 8000m, "Level 2", 40000m, 15000m, "L2" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), 60000m, 6000m, "Level 3", 30000m, 10000m, "L3" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), 50000m, 5000m, "Consultant 1", 25000m, 8000m, "C1" },
                    { new Guid("55555555-5555-5555-5555-555555555555"), 40000m, 4000m, "Consultant 2", 20000m, 6000m, "C2" },
                    { new Guid("66666666-6666-6666-6666-666666666666"), 30000m, 3000m, "Consultant 3", 15000m, 5000m, "C3" },
                    { new Guid("77777777-7777-7777-7777-777777777777"), 90000m, 9000m, "Manager 1", 45000m, 18000m, "M1" },
                    { new Guid("88888888-8888-8888-8888-888888888888"), 70000m, 7000m, "Manager 2", 35000m, 12000m, "M2" },
                    { new Guid("99999999-9999-9999-9999-999999999999"), 20000m, 2000m, "Entry Level 1", 10000m, 2000m, "E1" },
                    { new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), 15000m, 1500m, "Entry Level 2", 7500m, 1000m, "E2" }
                });

            migrationBuilder.InsertData(
                table: "Designations",
                columns: new[] { "Id", "DepartmentId", "Description", "Title" },
                values: new object[,]
                {
                    { new Guid("de000000-0000-0000-0000-000000000001"), new Guid("d1000000-0000-0000-0000-000000000001"), "HR Executive", "HR Executive" },
                    { new Guid("de000000-0000-0000-0000-000000000002"), new Guid("d1000000-0000-0000-0000-000000000001"), "HR Manager", "HR Manager" },
                    { new Guid("de000000-0000-0000-0000-000000000003"), new Guid("d1000000-0000-0000-0000-000000000001"), "Talent Acquisition Specialist", "Talent Acquisition Specialist" },
                    { new Guid("de000000-0000-0000-0000-000000000004"), new Guid("d1000000-0000-0000-0000-000000000002"), "Accountant", "Accountant" },
                    { new Guid("de000000-0000-0000-0000-000000000005"), new Guid("d1000000-0000-0000-0000-000000000002"), "Senior Accounts Manager", "Senior Accounts Manager" },
                    { new Guid("de000000-0000-0000-0000-000000000006"), new Guid("d1000000-0000-0000-0000-000000000002"), "Financial Analyst", "Financial Analyst" },
                    { new Guid("de000000-0000-0000-0000-000000000007"), new Guid("d1000000-0000-0000-0000-000000000003"), "Sales Executive", "Sales Executive" },
                    { new Guid("de000000-0000-0000-0000-000000000008"), new Guid("d1000000-0000-0000-0000-000000000003"), "Marketing Manager", "Marketing Manager" },
                    { new Guid("de000000-0000-0000-0000-000000000009"), new Guid("d1000000-0000-0000-0000-000000000003"), "Business Development Executive", "Business Development Executive" },
                    { new Guid("de000000-0000-0000-0000-000000000010"), new Guid("d1000000-0000-0000-0000-000000000004"), "Operations Manager", "Operations Manager" },
                    { new Guid("de000000-0000-0000-0000-000000000011"), new Guid("d1000000-0000-0000-0000-000000000004"), "Supply Chain Coordinator", "Supply Chain Coordinator" },
                    { new Guid("de000000-0000-0000-0000-000000000012"), new Guid("d1000000-0000-0000-0000-000000000004"), "Production Supervisor", "Production Supervisor" },
                    { new Guid("de000000-0000-0000-0000-000000000013"), new Guid("d1000000-0000-0000-0000-000000000005"), "R&D Engineer", "R&D Engineer" },
                    { new Guid("de000000-0000-0000-0000-000000000014"), new Guid("d1000000-0000-0000-0000-000000000005"), "Research Scientist", "Research Scientist" },
                    { new Guid("de000000-0000-0000-0000-000000000015"), new Guid("d1000000-0000-0000-0000-000000000005"), "Product Development Specialist", "Product Development Specialist" },
                    { new Guid("de000000-0000-0000-0000-000000000016"), new Guid("d1000000-0000-0000-0000-000000000006"), "Customer Support Executive", "Customer Support Executive" },
                    { new Guid("de000000-0000-0000-0000-000000000017"), new Guid("d1000000-0000-0000-0000-000000000006"), "Customer Success Manager", "Customer Success Manager" },
                    { new Guid("de000000-0000-0000-0000-000000000018"), new Guid("d1000000-0000-0000-0000-000000000006"), "Call Center Representative", "Call Center Representative" },
                    { new Guid("de000000-0000-0000-0000-000000000019"), new Guid("d1000000-0000-0000-0000-000000000007"), "Software Developer", "Software Developer" },
                    { new Guid("de000000-0000-0000-0000-000000000020"), new Guid("d1000000-0000-0000-0000-000000000007"), "IT Administrator", "IT Administrator" },
                    { new Guid("de000000-0000-0000-0000-000000000021"), new Guid("d1000000-0000-0000-0000-000000000007"), "Systems Analyst", "Systems Analyst" },
                    { new Guid("de000000-0000-0000-0000-000000000022"), new Guid("d1000000-0000-0000-0000-000000000008"), "IT Support Technician", "IT Support Technician" },
                    { new Guid("de000000-0000-0000-0000-000000000023"), new Guid("d1000000-0000-0000-0000-000000000008"), "Help Desk Specialist", "Help Desk Specialist" },
                    { new Guid("de000000-0000-0000-0000-000000000024"), new Guid("d1000000-0000-0000-0000-000000000008"), "Desktop Support Engineer", "Desktop Support Engineer" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Designations_DepartmentId",
                table: "Designations",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeLeaveAllocations_EmployeeId",
                table: "EmployeeLeaveAllocations",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_DepartmentId",
                table: "Employees",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_DesignationId",
                table: "Employees",
                column: "DesignationId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_EmployeeCode",
                table: "Employees",
                column: "EmployeeCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_LocationId",
                table: "Employees",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_ManagerId",
                table: "Employees",
                column: "ManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_SalaryStructureId",
                table: "Employees",
                column: "SalaryStructureId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_WorkEmail",
                table: "Employees",
                column: "WorkEmail",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRequests_EmployeeId",
                table: "LeaveRequests",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRequests_LeaveTypeId",
                table: "LeaveRequests",
                column: "LeaveTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_UserId",
                table: "RefreshTokens",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attendances");

            migrationBuilder.DropTable(
                name: "EmployeeLeaveAllocations");

            migrationBuilder.DropTable(
                name: "LeaveRequests");

            migrationBuilder.DropTable(
                name: "RefreshTokens");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "LeaveTypes");

            migrationBuilder.DropTable(
                name: "Designations");

            migrationBuilder.DropTable(
                name: "Locations");

            migrationBuilder.DropTable(
                name: "SalaryStructures");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Departments");
        }
    }
}
