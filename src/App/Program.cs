using App.DTOs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

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

app.MapGet("/api/lists", GetLists);

async ValueTask<IEnumerable<ListSummaryDto>> GetLists()
{
    await Task.Delay(5000);
    return Enumerable.Range(0, 5).Select(i =>
        new ListSummaryDto($"List {i}", DateTime.UtcNow));
}

app.MapFallbackToFile("index.html");;

app.Run();
