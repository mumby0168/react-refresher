using App.Data;
using App.DTOs;
using App.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
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
    x.ContainerPerItemType = true;
    x.ContainerBuilder
        .Configure<TodoList>(optionsBuilder =>
            optionsBuilder
                .WithContainer("todos")
                .WithPartitionKey("/pk")
                .WithServerlessThroughput())
        .Configure<TodoItem>(optionsBuilder =>
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

app.MapGet("/api/lists", GetLists)
    .RequireAuthorization();

app.MapPost("/api/lists", CreateList)
    .RequireAuthorization();

async ValueTask<IEnumerable<ListSummaryDto>> GetLists(
    HttpContext context,
    IReadOnlyRepository<TodoList> repository)
{
    var lists = await repository.GetTodoListsAsync(
        context.GetEmailAddress());

    return lists.Select(x =>
        new ListSummaryDto(x.Id, x.CreatedTimeUtc!.Value));
}

async ValueTask<IResult> CreateList(
    HttpContext context,
    [FromQuery] string name,
    IWriteOnlyRepository<TodoList> repository)
{
    if (string.IsNullOrWhiteSpace(name))
    {
        return Results.BadRequest(new {error = "A name must be provided"});
    }

    var list = new TodoList(name, context.GetEmailAddress());
    await repository.CreateAsync(list);
    return Results.Ok();
}

app.MapFallbackToFile("index.html");

app.Run();