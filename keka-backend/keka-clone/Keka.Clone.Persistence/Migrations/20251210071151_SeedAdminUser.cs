using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Keka.Clone.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role", "UpdatedAt" },
                values: new object[] { new Guid("85f3589d-7ed8-496c-a1b5-f6c975c1a1d7"), new DateTime(2025, 12, 10, 7, 11, 50, 981, DateTimeKind.Utc).AddTicks(205), "admin@keka.com", "Admin", true, "AQAAAAIAAYagAAAAEOm851cRKDy0NeIsMFPAGhs/PSktKwZifz3Kgku/Mijp9Wim9iF/7meEWx4t1Tz7pA==", "Admin", null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("85f3589d-7ed8-496c-a1b5-f6c975c1a1d7"));
        }
    }
}
