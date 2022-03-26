using Microsoft.Azure.CosmosRepository;

namespace App.Data;

public class TodoList : FullItem
{
    public TodoList(string name, string email)
    {
        Pk = $"{email}_{nameof(TodoList)}";
        Id = name;
    }

    public string Pk { get; set; }

    protected override string GetPartitionKeyValue() =>
        Pk;
}