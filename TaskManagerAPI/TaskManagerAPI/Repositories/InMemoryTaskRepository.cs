using TaskManagerAPI.Models;

namespace TaskManagerAPI.Repositories;

public sealed class InMemoryTaskRepository : ITaskRepository
{
    private readonly List<TaskItem> _tasks = [];
    private readonly object _lock = new();
    private int _nextId;

    public Task<IReadOnlyList<TaskItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_lock)
        {
            return Task.FromResult<IReadOnlyList<TaskItem>>(_tasks.ToList());
        }
    }

    public Task<TaskItem> AddAsync(string title, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var task = new TaskItem
        {
            Id = Interlocked.Increment(ref _nextId),
            Title = title.Trim(),
            IsComplete = false
        };

        lock (_lock)
        {
            _tasks.Add(task);
        }

        return Task.FromResult(task);
    }

    public Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        lock (_lock)
        {
            var index = _tasks.FindIndex(t => t.Id == id);
            if (index < 0)
            {
                return Task.FromResult(false);
            }

            _tasks.RemoveAt(index);
            return Task.FromResult(true);
        }
    }
}
