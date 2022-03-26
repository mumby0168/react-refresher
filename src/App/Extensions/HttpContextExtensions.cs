using System.Security.Claims;

namespace App.Extensions;

public static class HttpContextExtensions
{
    public static string GetEmailAddress(this HttpContext httpContext) =>
        httpContext.User.Claims.First(x => x.Type is ClaimTypes.Email).Value;
}