namespace TaskManagerAPI.Models;

public class TaskItem
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public bool IsComplete { get; init; }
}
