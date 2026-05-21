using Moq;
using TaskManagerAPI.Exceptions;
using TaskManagerAPI.Models;
using TaskManagerAPI.Repositories;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Tests.Services;

public class TaskServiceTests
{
    private readonly Mock<ITaskRepository> _repositoryMock = new();
    private readonly TaskService _sut;

    public TaskServiceTests()
    {
        _sut = new TaskService(_repositoryMock.Object);
    }

    [Fact]
    public async Task GetAllTasksAsync_ReturnsRepositoryResult()
    {
        var tasks = new List<TaskItem>
        {
            new() { Id = 1, Title = "One", IsComplete = false }
        };
        _repositoryMock.Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(tasks);

        var result = await _sut.GetAllTasksAsync();

        Assert.Same(tasks, result);
        _repositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateTaskAsync_WithValidTitle_ReturnsCreatedTask()
    {
        var created = new TaskItem { Id = 1, Title = "New task", IsComplete = false };
        _repositoryMock.Setup(r => r.AddAsync("New task", It.IsAny<CancellationToken>()))
            .ReturnsAsync(created);

        var result = await _sut.CreateTaskAsync("New task");

        Assert.Equal(created, result);
        _repositoryMock.Verify(r => r.AddAsync("New task", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task CreateTaskAsync_WithInvalidTitle_ThrowsArgumentException(string? title)
    {
        await Assert.ThrowsAnyAsync<ArgumentException>(() => _sut.CreateTaskAsync(title!));

        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task DeleteTaskAsync_WithExistingId_CompletesSuccessfully()
    {
        _repositoryMock.Setup(r => r.DeleteAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        await _sut.DeleteTaskAsync(1);

        _repositoryMock.Verify(r => r.DeleteAsync(1, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteTaskAsync_WithNonExistentId_ThrowsTaskNotFoundException()
    {
        _repositoryMock.Setup(r => r.DeleteAsync(42, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        var exception = await Assert.ThrowsAsync<TaskNotFoundException>(() => _sut.DeleteTaskAsync(42));

        Assert.Equal(42, exception.TaskId);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public async Task DeleteTaskAsync_WithInvalidId_ThrowsArgumentOutOfRangeException(int id)
    {
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => _sut.DeleteTaskAsync(id));

        _repositoryMock.Verify(r => r.DeleteAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
