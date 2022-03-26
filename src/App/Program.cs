using App.Data;
using App.DTOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Azure.CosmosRepository;
using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration);

builder.Services.AddControllersWithViews();
builder.Services.AddCosmosRepository(x =>
{
    x.DatabaseId = "react-todo-db";
    x.ContainerBuilder
        .Configure<TodoList>(optionsBuilder =>
            optionsBuilder
                .WithContainer("todos")
                .WithPartitionKey("/pk")
                .WithServerlessThroughput());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/lists", GetLists);

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
async ValueTask<IEnumerable<ListSummaryDto>> GetLists(IReadOnlyRepository<TodoList> repository, HttpContext httpContext)
{
    var lists = await repository.GetAsync(x => x.Pk == nameof(TodoList));
    return lists.Select(x =>
        new ListSummaryDto(x.Id, x.CreatedTimeUtc!.Value));
}

app.MapFallbackToFile("index.html");

app.Run();