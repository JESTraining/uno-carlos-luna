using TaskManagerAPI.Repositories;

namespace TaskManagerAPI.Tests.Repositories;

public class InMemoryTaskRepositoryTests
{
    [Fact]
    public async Task GetAllAsync_WhenEmpty_ReturnsEmptyList()
    {
        var repository = new InMemoryTaskRepository();

        var result = await repository.GetAllAsync();

        Assert.Empty(result);
    }

    [Fact]
    public async Task AddAsync_WithValidTitle_CreatesTaskWithDefaults()
    {
        var repository = new InMemoryTaskRepository();

        var task = await repository.AddAsync("  Buy groceries  ");

        Assert.Equal(1, task.Id);
        Assert.Equal("Buy groceries", task.Title);
        Assert.False(task.IsComplete);
    }

    [Fact]
    public async Task GetAllAsync_AfterAddingTasks_ReturnsAllTasks()
    {
        var repository = new InMemoryTaskRepository();
        await repository.AddAsync("Task A");
        await repository.AddAsync("Task B");

        var result = await repository.GetAllAsync();

        Assert.Equal(2, result.Count);
        Assert.Contains(result, t => t.Title == "Task A");
        Assert.Contains(result, t => t.Title == "Task B");
    }

    [Fact]
    public async Task DeleteAsync_WithExistingId_RemovesTask()
    {
        var repository = new InMemoryTaskRepository();
        var task = await repository.AddAsync("To delete");

        var deleted = await repository.DeleteAsync(task.Id);
        var remaining = await repository.GetAllAsync();

        Assert.True(deleted);
        Assert.Empty(remaining);
    }

    [Fact]
    public async Task DeleteAsync_WithNonExistentId_ReturnsFalse()
    {
        var repository = new InMemoryTaskRepository();

        var deleted = await repository.DeleteAsync(999);

        Assert.False(deleted);
    }
}
