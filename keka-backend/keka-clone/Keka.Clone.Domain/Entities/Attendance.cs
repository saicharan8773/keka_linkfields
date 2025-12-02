public class Attendance
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime Date { get; set; }
    public DateTime? LoginTimeUtc { get; set; }
    public DateTime? LogoutTimeUtc { get; set; }
    public double? LoginLat { get; set; }
    public double? LoginLng { get; set; }
    public double? LogoutLat { get; set; }
    public double? LogoutLng { get; set; }
    public double? WorkedHours { get; set; }
    public string? Notes { get; set; }
}
