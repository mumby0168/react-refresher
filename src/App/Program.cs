using App.Data;
using App.DTOs;
using Microsoft.Azure.CosmosRepository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

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

var listsRepo = app.Services.GetRequiredService<IWriteOnlyRepository<TodoList>>();
await listsRepo.CreateAsync(new TodoList($"List {DateTime.UtcNow.Millisecond}"));

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapGet("/api/lists", GetLists);

async ValueTask<IEnumerable<ListSummaryDto>> GetLists(IReadOnlyRepository<TodoList> repository)
{
    var lists = await repository.GetAsync(x => x.Pk == nameof(TodoList));
    return lists.Select(x =>
        new ListSummaryDto(x.Id, x.CreatedTimeUtc!.Value));
}

app.MapFallbackToFile("index.html");
;

app.Run();