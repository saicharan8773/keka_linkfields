using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keka.Clone.Application.DTOs.Attendance
{
    public class GeoDto 
    {
        public Guid UserId { get; set; } 
        public double Lat { get; set; }
        public double Lng { get; set; } 
    }
}
