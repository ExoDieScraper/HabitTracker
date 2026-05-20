using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HabitTrackerAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddHabitCompletions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompletedToday",
                table: "Habits");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Habits");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Habits");

            migrationBuilder.DropColumn(
                name: "LastCompletedDate",
                table: "Habits");

            migrationBuilder.DropColumn(
                name: "Streak",
                table: "Habits");

            migrationBuilder.CreateTable(
                name: "HabitCompletions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    HabitId = table.Column<int>(type: "INTEGER", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HabitCompletions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HabitCompletions_Habits_HabitId",
                        column: x => x.HabitId,
                        principalTable: "Habits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Habits_UserId",
                table: "Habits",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_HabitCompletions_HabitId",
                table: "HabitCompletions",
                column: "HabitId");

            migrationBuilder.AddForeignKey(
                name: "FK_Habits_Users_UserId",
                table: "Habits",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Habits_Users_UserId",
                table: "Habits");

            migrationBuilder.DropTable(
                name: "HabitCompletions");

            migrationBuilder.DropIndex(
                name: "IX_Habits_UserId",
                table: "Habits");

            migrationBuilder.AddColumn<bool>(
                name: "CompletedToday",
                table: "Habits",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Habits",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Habits",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastCompletedDate",
                table: "Habits",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Streak",
                table: "Habits",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
