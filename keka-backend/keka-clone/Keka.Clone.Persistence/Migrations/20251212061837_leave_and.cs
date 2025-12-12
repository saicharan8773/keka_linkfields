using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Keka.Clone.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class leave_and : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("3452975c-2742-46b1-9d04-0b89851bbf63"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role", "UpdatedAt" },
                values: new object[] { new Guid("c8e95717-317e-469a-8be0-5297e10f7d22"), new DateTime(2025, 12, 12, 6, 18, 36, 604, DateTimeKind.Utc).AddTicks(1353), "admin@keka.com", "Admin", true, "AQAAAAIAAYagAAAAEDaHsJetT3+vEo6zxHllpvj+TVgLwlN8NgXwDPC0/ubD8h6dQP8jI3xpWBnvDiJ4wg==", "Admin", null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("c8e95717-317e-469a-8be0-5297e10f7d22"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role", "UpdatedAt" },
                values: new object[] { new Guid("3452975c-2742-46b1-9d04-0b89851bbf63"), new DateTime(2025, 12, 12, 6, 17, 33, 173, DateTimeKind.Utc).AddTicks(6618), "admin@keka.com", "Admin", true, "AQAAAAIAAYagAAAAEBH/omvcAYJUPWDozooqZAaTXO8yWjyyzmdajyKe7fdXpMfDYTFJVhpCuoY1MoKRSA==", "Admin", null });
        }
    }
}
