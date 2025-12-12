using Keka.Clone.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Keka.Clone.Application.Interfaces;
using Keka.Clone.Application.DTOs.Employee;

namespace Keka.Clone.Persistence.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly AppDbContext _db;

        public EmployeeRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(Employee employee)
        {
            await _db.Employees.AddAsync(employee);
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Employee employee)
        {
            _db.Employees.Remove(employee);
        }

        public async Task<Employee?> GetByWorkEmailAsync(string email)
        {
            return await _db.Employees.FirstOrDefaultAsync(e => e.WorkEmail == email);
        }

        public async Task<Employee?> GetByIdAsync(Guid id)
        {
            return await _db.Employees
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .Include(e => e.Manager)
                .Include(e => e.Location)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task UpdateAsync(Employee employee)
        {
            _db.Employees.Update(employee);
        }

        public async Task<IEnumerable<Employee>> GetByDepartmentIdAsync(Guid departmentId)
        {
            return await _db.Employees
                .Where(e => e.DepartmentId == departmentId)
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .Include(e => e.Manager)
                .ToListAsync();
        }

        public async Task<IEnumerable<Employee>> GetByDesignationIdAsync(Guid designationId)
        {
            return await _db.Employees
                .Where(e => e.DesignationId == designationId)
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .Include(e => e.Manager)
                .ToListAsync();
        }

        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            return await _db.Employees
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .Include(e => e.Manager)
                .Include(e => e.Location)
                .ToListAsync();
        }

        public async Task<IEnumerable<ManagerDto>> GetManagersAsync()
        {
            // Join Users with Employees on Email
            // Filter by User Role = 'Manager' or 'Admin'
            
            var query = from u in _db.Users
                        where u.Role == "Manager"
                        select new ManagerDto
                        {
                            Id = u.Id,
                            Email= u.Email,
                            FullName = u.FullName, // User's FullName is reliable
                        };

            var result = await query.OrderBy(x => x.FullName).ToListAsync();
            return result;
        }
        public async Task<(IEnumerable<Employee> Items, int Total)> SearchAsync(
            string? query,
            Guid? departmentId,
            Guid? designationId,
            Guid? managerId,
            Guid? locationId,
            string? employmentType,
            int page,
            int pageSize,
            string? sortBy,
            bool sortDesc)
        {
            var q = _db.Employees.AsQueryable();

            // 1. Searching (NULL SAFE)
            if (!string.IsNullOrWhiteSpace(query))
            {
                var like = $"%{query.ToLower()}%";

                q = q.Where(e =>
                    EF.Functions.Like((e.EmployeeCode ?? "").ToLower(), like) ||
                    EF.Functions.Like((e.FirstName ?? "").ToLower(), like) ||
                    EF.Functions.Like((e.LastName ?? "").ToLower(), like) ||
                    EF.Functions.Like((e.DisplayName ?? "").ToLower(), like) ||
                    EF.Functions.Like((e.WorkEmail ?? "").ToLower(), like) ||
                    EF.Functions.Like((e.MobileNumber ?? "").ToLower(), like) ||
                    EF.Functions.Like((e.EmploymentType ?? "").ToLower(), like) ||
                    EF.Functions.Like((e.Department != null ? e.Department.Name : "").ToLower(), like) ||
                    EF.Functions.Like((e.Designation != null ? e.Designation.Title : "").ToLower(), like)
                );
            }

            // ---------- 2. FILTERS ----------
            if (departmentId.HasValue)
                q = q.Where(e => e.DepartmentId == departmentId);

            if (designationId.HasValue)
                q = q.Where(e => e.DesignationId == designationId);

            if (managerId.HasValue)
                q = q.Where(e => e.ManagerId == managerId);

            if (locationId.HasValue)
                q = q.Where(e => e.LocationId == locationId);

            if (!string.IsNullOrWhiteSpace(employmentType))
                q = q.Where(e => e.EmploymentType.ToLower() == employmentType.ToLower());

            var total = await q.CountAsync();

            // ---------- 3. SORTING ----------
            if (!string.IsNullOrWhiteSpace(sortBy))
            {
                sortBy = sortBy.ToLower();
                q = sortBy switch
                {
                    "firstname" => sortDesc ? q.OrderByDescending(e => e.FirstName) : q.OrderBy(e => e.FirstName),
                    "joiningdate" => sortDesc ? q.OrderByDescending(e => e.JoiningDate) : q.OrderBy(e => e.JoiningDate),
                    _ => q.OrderBy(e => e.EmployeeCode)
                };
            }
            else
            {
                q = q.OrderBy(e => e.EmployeeCode);
            }

            // ---------- 4. INCLUDE RELATED ENTITIES ----------
            var withIncludes = q
                .Include(e => e.Department)
                .Include(e => e.Designation)
                .Include(e => e.Manager)
                .Include(e => e.Location);

            // ---------- 5. REMOVE PAGINATION WHEN SEARCH QUERY IS USED ----------
            List<Employee> items;

            if (!string.IsNullOrWhiteSpace(query) || pageSize == -1)
            {
                items = await withIncludes.ToListAsync();
            }
            else
            {
                items = await withIncludes
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();
            }

            return (items, total);
        }
    }
}
