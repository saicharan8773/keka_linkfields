using System;
using System.Threading.Tasks;
using Keka.Clone.Application.Interfaces;

namespace Keka.Clone.Infrastructure.Services
{
    public class NotificationService : INotificationService
    {
        public Task NotifyAsync(string recipientId, string subject, string message)
        {
            // In a real app, this would send an email or push notification.
            // For now, we'll just log to console or do nothing.
            Console.WriteLine($"[Notification] To: {recipientId}, Subject: {subject}, Message: {message}");
            return Task.CompletedTask;
        }
    }
}
