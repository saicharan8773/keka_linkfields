using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Keka.Clone.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class entitythings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("cbb7d38f-3d48-47cc-95f7-bf415ab16ba4"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role", "UpdatedAt" },
                values: new object[] { new Guid("903c0f30-0785-47d6-8c25-0d07bfe93f94"), new DateTime(2025, 12, 12, 11, 34, 54, 156, DateTimeKind.Utc).AddTicks(1443), "admin@keka.com", "Admin", true, "AQAAAAIAAYagAAAAEMK9r8wpY2N1ro2dY6l/+PcPcyAUhBXytBWdQoiLvwFHRI+1HtZrnS9UDB0EQAf/Gg==", "Admin", null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("903c0f30-0785-47d6-8c25-0d07bfe93f94"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role", "UpdatedAt" },
                values: new object[] { new Guid("cbb7d38f-3d48-47cc-95f7-bf415ab16ba4"), new DateTime(2025, 12, 12, 11, 34, 6, 827, DateTimeKind.Utc).AddTicks(9955), "admin@keka.com", "Admin", true, "AQAAAAIAAYagAAAAECqUYY4M61hQbX15TngiaM0CWbiXEWJITvS9IubBsgcx3Ll8btAs+sqfSdlc4tUxtg==", "Admin", null });
        }
    }
}
