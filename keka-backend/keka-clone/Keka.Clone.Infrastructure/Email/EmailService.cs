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

namespace Keka.Clone.Infrastructure.Email
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _env;

        public EmailService(IConfiguration config, IWebHostEnvironment env)
        {
            _config = config;
            _env = env;
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

            await smtp.SendMailAsync(msg);
        }
    }
}
