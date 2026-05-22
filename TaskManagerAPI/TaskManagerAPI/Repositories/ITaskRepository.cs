using TaskManagerAPI.Models;

namespace TaskManagerAPI.Repositories;

public interface ITaskRepository
{
    Task<IReadOnlyList<TaskItem>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<TaskItem> AddAsync(string title, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<TaskItem?> ToggleCompleteAsync(int id, CancellationToken cancellationToken = default);
}
