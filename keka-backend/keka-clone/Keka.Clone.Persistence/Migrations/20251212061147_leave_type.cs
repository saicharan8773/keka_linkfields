using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Keka.Clone.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class leave_type : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("85f3589d-7ed8-496c-a1b5-f6c975c1a1d7"));

            migrationBuilder.AlterColumn<string>(
                name: "RequestCode",
                table: "LeaveRequests",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "LeaveRequestId",
                table: "Employees",
                type: "int",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role", "UpdatedAt" },
                values: new object[] { new Guid("3b21b957-0bf9-45e0-a29c-fa0ba4ecc668"), new DateTime(2025, 12, 12, 6, 11, 46, 43, DateTimeKind.Utc).AddTicks(9891), "admin@keka.com", "Admin", true, "AQAAAAIAAYagAAAAECP+hqSavhwMU1WPTXNWBVLwQdS4uBM7yIq6mouaZQpYbJhB7kTNy8qJVPoXPzdf1w==", "Admin", null });

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRequests_RequestCode",
                table: "LeaveRequests",
                column: "RequestCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_LeaveRequestId",
                table: "Employees",
                column: "LeaveRequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_LeaveRequests_LeaveRequestId",
                table: "Employees",
                column: "LeaveRequestId",
                principalTable: "LeaveRequests",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Employees_LeaveRequests_LeaveRequestId",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_LeaveRequests_RequestCode",
                table: "LeaveRequests");

            migrationBuilder.DropIndex(
                name: "IX_Employees_LeaveRequestId",
                table: "Employees");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("3b21b957-0bf9-45e0-a29c-fa0ba4ecc668"));

            migrationBuilder.DropColumn(
                name: "LeaveRequestId",
                table: "Employees");

            migrationBuilder.AlterColumn<string>(
                name: "RequestCode",
                table: "LeaveRequests",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role", "UpdatedAt" },
                values: new object[] { new Guid("85f3589d-7ed8-496c-a1b5-f6c975c1a1d7"), new DateTime(2025, 12, 10, 7, 11, 50, 981, DateTimeKind.Utc).AddTicks(205), "admin@keka.com", "Admin", true, "AQAAAAIAAYagAAAAEOm851cRKDy0NeIsMFPAGhs/PSktKwZifz3Kgku/Mijp9Wim9iF/7meEWx4t1Tz7pA==", "Admin", null });
        }
    }
}
