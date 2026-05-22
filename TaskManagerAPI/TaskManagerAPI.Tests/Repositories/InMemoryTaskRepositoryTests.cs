using TaskManagerAPI.Repositories;
using TaskManagerAPI.Tests.Support;

namespace TaskManagerAPI.Tests.Repositories;

public class InMemoryTaskRepositoryTests : AutoFixtureTestBase
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
        var rawTitle = $"  {Fixture.CreateTitle()}  ";

        var task = await repository.AddAsync(rawTitle);

        Assert.Equal(1, task.Id);
        Assert.Equal(rawTitle.Trim(), task.Title);
        Assert.False(task.IsComplete);
    }

    [Fact]
    public async Task GetAllAsync_AfterAddingTasks_ReturnsAllTasks()
    {
        var repository = new InMemoryTaskRepository();
        var firstTitle = Fixture.CreateTitle();
        var secondTitle = Fixture.CreateTitle();
        await repository.AddAsync(firstTitle);
        await repository.AddAsync(secondTitle);

        var result = await repository.GetAllAsync();

        Assert.Equal(2, result.Count);
        Assert.Contains(result, t => t.Title == firstTitle);
        Assert.Contains(result, t => t.Title == secondTitle);
    }

    [Fact]
    public async Task DeleteAsync_WithExistingId_RemovesTask()
    {
        var repository = new InMemoryTaskRepository();
        var task = await repository.AddAsync(Fixture.CreateTitle());

        var deleted = await repository.DeleteAsync(task.Id);
        var remaining = await repository.GetAllAsync();

        Assert.True(deleted);
        Assert.Empty(remaining);
    }

    [Fact]
    public async Task DeleteAsync_WithNonExistentId_ReturnsFalse()
    {
        var repository = new InMemoryTaskRepository();

        var deleted = await repository.DeleteAsync(Fixture.CreateNonExistentId());

        Assert.False(deleted);
    }

    [Fact]
    public async Task ToggleCompleteAsync_WithExistingId_TogglesCompletionState()
    {
        var repository = new InMemoryTaskRepository();
        var task = await repository.AddAsync(Fixture.CreateTitle());

        var firstToggle = await repository.ToggleCompleteAsync(task.Id);
        var secondToggle = await repository.ToggleCompleteAsync(task.Id);

        Assert.NotNull(firstToggle);
        Assert.True(firstToggle!.IsComplete);
        Assert.NotNull(secondToggle);
        Assert.False(secondToggle!.IsComplete);
    }

    [Fact]
    public async Task ToggleCompleteAsync_WithNonExistentId_ReturnsNull()
    {
        var repository = new InMemoryTaskRepository();

        var result = await repository.ToggleCompleteAsync(Fixture.CreateNonExistentId());

        Assert.Null(result);
    }
}
