using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Keka.Clone.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class leaves : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RequestCode",
                table: "LeaveRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequestCode",
                table: "LeaveRequests");
        }
    }
}
