using Moq;
using TaskManagerAPI.Exceptions;
using TaskManagerAPI.Models;
using TaskManagerAPI.Repositories;
using TaskManagerAPI.Services;
using TaskManagerAPI.Tests.Support;

namespace TaskManagerAPI.Tests.Services;

public class TaskServiceTests : AutoFixtureTestBase
{
    private readonly Mock<ITaskRepository> _repositoryMock = new();
    private readonly TaskService _taskService;

    public TaskServiceTests()
    {
        _taskService = new TaskService(_repositoryMock.Object);
    }

    [Fact]
    public async Task GetAllTasksAsync_ReturnsRepositoryResult()
    {
        var tasks = Fixture.CreateMany<TaskItem>(3).ToList();
        _repositoryMock.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(tasks);

        var result = await _taskService.GetAllTasksAsync();

        Assert.Same(tasks, result);
        _repositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateTaskAsync_WithValidTitle_ReturnsCreatedTask()
    {
        var title = Fixture.CreateTitle();
        var created = Fixture.Build<TaskItem>()
            .With(t => t.Title, title)
            .With(t => t.IsComplete, false)
            .Create();
        _repositoryMock.Setup(r => r.AddAsync(title, It.IsAny<CancellationToken>()))
            .ReturnsAsync(created);

        var result = await _taskService.CreateTaskAsync(title);

        Assert.Equal(created, result);
        _repositoryMock.Verify(r => r.AddAsync(title, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task CreateTaskAsync_WithInvalidTitle_ThrowsArgumentException(string? title)
    {
        await Assert.ThrowsAnyAsync<ArgumentException>(() => _taskService.CreateTaskAsync(title!));

        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task DeleteTaskAsync_WithExistingId_CompletesSuccessfully()
    {
        var id = Fixture.CreatePositiveId();
        _repositoryMock.Setup(r => r.DeleteAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        await _taskService.DeleteTaskAsync(id);

        _repositoryMock.Verify(r => r.DeleteAsync(id, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteTaskAsync_WithNonExistentId_ThrowsTaskNotFoundException()
    {
        var id = Fixture.CreatePositiveId();
        _repositoryMock.Setup(r => r.DeleteAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        var exception = await Assert.ThrowsAsync<TaskNotFoundException>(() => _taskService.DeleteTaskAsync(id));

        Assert.Equal(id, exception.TaskId);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public async Task DeleteTaskAsync_WithInvalidId_ThrowsArgumentOutOfRangeException(int id)
    {
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => _taskService.DeleteTaskAsync(id));

        _repositoryMock.Verify(r => r.DeleteAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task ToggleTaskCompleteAsync_WithExistingId_ReturnsUpdatedTask()
    {
        var id = Fixture.CreatePositiveId();
        var updated = Fixture.Build<TaskItem>().With(t => t.Id, id).With(t => t.IsComplete, true).Create();
        _repositoryMock.Setup(r => r.ToggleCompleteAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync(updated);

        var result = await _taskService.ToggleTaskCompleteAsync(id);

        Assert.Equal(updated, result);
        _repositoryMock.Verify(r => r.ToggleCompleteAsync(id, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ToggleTaskCompleteAsync_WithNonExistentId_ThrowsTaskNotFoundException()
    {
        var id = Fixture.CreatePositiveId();
        _repositoryMock.Setup(r => r.ToggleCompleteAsync(id, It.IsAny<CancellationToken>()))
            .ReturnsAsync((TaskItem?)null);

        var exception = await Assert.ThrowsAsync<TaskNotFoundException>(
            () => _taskService.ToggleTaskCompleteAsync(id));

        Assert.Equal(id, exception.TaskId);
    }
}
