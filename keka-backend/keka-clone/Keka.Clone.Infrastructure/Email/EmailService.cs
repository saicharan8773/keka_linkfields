using Keka.Clone.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Keka.Clone.Infrastructure.Email
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, IWebHostEnvironment env, ILogger<EmailService> logger)
        {
            _config = config;
            _env = env;
            _logger = logger;
        }

        public async Task SendTemplateAsync(
            string to,
            string subject,
            string templateName,
            Dictionary<string, string> placeholders)
        {
            var rootPath = Path.Combine(_env.WebRootPath, "Templates");
            var filePath = Path.Combine(rootPath, templateName);

            var html = await File.ReadAllTextAsync(filePath);

            foreach (var ph in placeholders)
            {
                html = html.Replace($"{{{{{ph.Key}}}}}", ph.Value);
            }

            await SendEmailAsync(to, subject, html);
        }

        private async Task SendEmailAsync(string to, string subject, string bodyHtml)
        {
            try
            {
                var settings = _config.GetSection("EmailSettings");

                using var smtp = new SmtpClient
                {
                    Host = settings["Host"]!,
                    Port = int.Parse(settings["Port"]!),
                    EnableSsl = bool.Parse(settings["EnableSSL"]!),
                    Credentials = new NetworkCredential(settings["Username"], settings["Password"])
                };

                var msg = new MailMessage
                {
                    From = new MailAddress(settings["Username"]!),
                    Subject = subject,
                    Body = bodyHtml,
                    IsBodyHtml = true
                };

                msg.To.Add(to);

                _logger.LogInformation("Sending email to {To} with subject {Subject}", to, subject);
                await smtp.SendMailAsync(msg);
                _logger.LogInformation("Email sent successfully to {To}", to);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending email to {To} with subject {Subject}", to, subject);
            }
        }
    }
}
