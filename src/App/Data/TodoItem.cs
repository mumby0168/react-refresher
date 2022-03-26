using Microsoft.Azure.CosmosRepository;

namespace App.Data;

public class TodoItem : FullItem
{
    public TodoItem(string name, DateTime? completedAt, string listName)
    {
        Name = name;
        CompletedAt = completedAt;
        Pk = listName;
    }

    public string Name { get; set; }

    public DateTime? CompletedAt { get; set; }

    public bool IsComplete =>
        CompletedAt is not null;

    public string Pk { get; set; }

    protected override string GetPartitionKeyValue() =>
        Pk;
}