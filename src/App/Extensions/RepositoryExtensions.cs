using App.Data;
using Microsoft.Azure.CosmosRepository;

namespace App.Extensions;

public static class RepositoryExtensions
{
    public static async Task<IEnumerable<TodoList>> GetTodoListsAsync(
        this IReadOnlyRepository<TodoList> repository,
        string email)
    {
        var pk = $"{email}_{nameof(TodoList)}";
        return await repository.GetAsync(x => x.Pk == pk);
    }
}