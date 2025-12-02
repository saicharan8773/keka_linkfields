using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Keka.Clone.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class leaverequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "LeaveTypes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Code", "DefaultDays" },
                values: new object[] { "CL", 8 });

            migrationBuilder.UpdateData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Code", "DefaultDays", "Name" },
                values: new object[] { "Comp Off", 15, "Compensatory Off" });

            migrationBuilder.UpdateData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Code", "DefaultDays" },
                values: new object[] { "EL", 15 });

            migrationBuilder.UpdateData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Code", "DefaultDays" },
                values: new object[] { "Floater", 3 });

            migrationBuilder.UpdateData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Code", "IsUnlimited" },
                values: new object[] { "LOP", true });

            migrationBuilder.UpdateData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Code", "DefaultDays" },
                values: new object[] { "Maternity", 182 });

            migrationBuilder.UpdateData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "Code", "DefaultDays" },
                values: new object[] { "SL", 10 });

            migrationBuilder.InsertData(
                table: "LeaveTypes",
                columns: new[] { "Id", "Code", "DefaultDays", "IsUnlimited", "Name" },
                values: new object[] { 8, "Paternity", 14, false, "Paternity Leave" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DropColumn(
                name: "Code",
                table: "LeaveTypes");

            migrationBuilder.UpdateData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 1,
                column: "DefaultDays",
                value: 0);

            migrationBuilder.UpdateData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DefaultDays", "Name" },
                values: new object[] { 0, "Comp Offs" });

            migrationBuilder.UpdateData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 3,
                column: "DefaultDays",
                value: 0);

            migrationBuilder.UpdateData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 4,
                column: "DefaultDays",
                value: 0);

            migrationBuilder.UpdateData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 5,
                column: "IsUnlimited",
                value: false);

            migrationBuilder.UpdateData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 6,
                column: "DefaultDays",
                value: 0);

            migrationBuilder.UpdateData(
                table: "LeaveTypes",
                keyColumn: "Id",
                keyValue: 7,
                column: "DefaultDays",
                value: 0);
        }
    }
}
