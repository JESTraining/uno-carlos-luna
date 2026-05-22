using TaskManagerAPI.Models;

namespace TaskManagerAPI.Services;

public interface ITaskService
{
    Task<IReadOnlyList<TaskItem>> GetAllTasksAsync(CancellationToken cancellationToken = default);
    Task<TaskItem> CreateTaskAsync(string title, CancellationToken cancellationToken = default);
    Task DeleteTaskAsync(int id, CancellationToken cancellationToken = default);
    Task<TaskItem> ToggleTaskCompleteAsync(int id, CancellationToken cancellationToken = default);
}
