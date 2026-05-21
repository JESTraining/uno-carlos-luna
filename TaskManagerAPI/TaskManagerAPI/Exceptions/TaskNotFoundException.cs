namespace TaskManagerAPI.Exceptions;

public sealed class TaskNotFoundException : Exception
{
    public TaskNotFoundException(int id)
        : base($"Task with id {id} was not found.")
    {
        TaskId = id;
    }

    public int TaskId { get; }
}
