using System.Threading.Tasks;

namespace Keka.Clone.Application.Interfaces
{
    public interface INotificationService
    {
        Task NotifyAsync(string recipientId, string subject, string message);
    }
}
