using App.Data;
using App.DTOs;
using App.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.CosmosRepository;
using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);

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

app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/lists", GetLists)
    .RequireAuthorization();

app.MapGet("/api/lists/{listName}/items", GetTodoItems)
    .RequireAuthorization();

app.MapPost("/api/lists/{listName}/items", CreateTodoItem)
    .RequireAuthorization();

app.MapPut("/api/lists/{listName}/items/{itemId}/complete", CompleteTodo)
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

async ValueTask<IEnumerable<TodoItemDto>> GetTodoItems(
    [FromRoute] string listName,
    IReadOnlyRepository<TodoItem> repository)
{
    var items = await repository.GetAsync(x =>
        x.Pk == listName);

    return items.Select(x => new TodoItemDto(
        x.Id,
        x.Name,
        x.CreatedTimeUtc!.Value,
        x.CompletedAt,
        x.IsComplete));
}

async ValueTask<IResult> CreateTodoItem(
    [FromRoute] string listName,
    [FromQuery] string title,
    IWriteOnlyRepository<TodoItem> repository)
{
    if (string.IsNullOrWhiteSpace(listName) || string.IsNullOrWhiteSpace(title))
    {
        return Results.BadRequest(new {error = "Both a list name and a title must be provided"});
    }

    var item = new TodoItem(title, listName);
    await repository.CreateAsync(item);

    return Results.Ok();
}

async ValueTask<IResult> CompleteTodo(
    [FromRoute] string listName,
    [FromRoute] string itemId,
    IRepository<TodoItem> repository)
{
    if (string.IsNullOrWhiteSpace(listName) || string.IsNullOrWhiteSpace(itemId))
    {
        return Results.BadRequest(new {error = "Both a list name and an item ID must be provided"});
    }

    var item = await repository.TryGetAsync(
        itemId,
        listName);

    if (item is null)
    {
        return Results.NotFound();
    }

    item.CompletedAt = DateTime.UtcNow;
    await repository.UpdateAsync(item);

    return Results.Ok();
}

app.MapFallbackToFile("index.html");

app.Run();