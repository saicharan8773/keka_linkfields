using System.Text;
using AutoMapper;
using FluentValidation;
using FluentValidation.AspNetCore;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Application.Mappings;
using Keka.Clone.Application.Services;
using Keka.Clone.Application.Validators;
using Keka.Clone.Infrastructure.Email;
using Keka.Clone.Persistence;
using Keka.Clone.Persistence.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
var dbName = "KekaCloneDb";
var masterConn = "Server=.\\SQLEXPRESS;Trusted_Connection=True;TrustServerCertificate=True;";
using (var conn = new SqlConnection(masterConn))
{
    conn.Open();
    string createDbSql = $@"
        IF DB_ID('{dbName}') IS NULL 
        BEGIN
            CREATE DATABASE [{dbName}];
        END";
    using var cmd = new SqlCommand(createDbSql, conn);
    cmd.ExecuteNonQuery();
}
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.AddLogging();
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation(o => o.DisableDataAnnotationsValidation = true);
builder.Services.AddValidatorsFromAssemblyContaining<CreateEmployeeRequestValidator>();
builder.Services.AddAutoMapper(typeof(EmployeeProfile));
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ILeaveRequestRepository, LeaveRequestRepository>();
builder.Services.AddScoped<IEmployeeLeaveAllocationRepository, EmployeeLeaveAllocationRepository>();
builder.Services.AddScoped<ILeaveTypeRepository, LeaveTypeRepository>();
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IAttendanceService, AttendanceService>();

// Designations
builder.Services.AddScoped<IDesignationRepository, DesignationRepository>();
builder.Services.AddScoped<IDesignationService, DesignationService>();

// Salary Structures
builder.Services.AddScoped<ISalaryStructureRepository, SalaryStructureRepository>();
builder.Services.AddScoped<ISalaryStructureService, SalaryStructureService>();

// Locations
builder.Services.AddScoped<ILocationRepository, LocationRepository>();
builder.Services.AddScoped<ILocationService, LocationService>();

// Mappings
builder.Services.AddAutoMapper(typeof(MasterDataProfile));
builder.Services.AddScoped<ILeaveService, LeaveService>();
builder.Services.AddScoped<INotificationService, Keka.Clone.Infrastructure.Services.NotificationService>();
builder.Services.AddScoped<IEmailService, EmailService>();
var jwtSection = builder.Configuration.GetSection("Jwt");
var keyBytes = Encoding.UTF8.GetBytes(jwtSection["Key"]!);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidIssuer = jwtSection["Issuer"],
        ValidAudience = jwtSection["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
    };
});
builder.Services.AddAuthorization();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Keka Clone API",
        Version = "v1"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your token}"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", p =>
    {
        p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();