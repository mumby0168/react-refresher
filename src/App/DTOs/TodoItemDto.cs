namespace App.DTOs;

public record TodoItemDto(
    string Id,
    string Title,
    DateTime CreatedAt,
    DateTime? CompletedAt,
    bool IsComplete);