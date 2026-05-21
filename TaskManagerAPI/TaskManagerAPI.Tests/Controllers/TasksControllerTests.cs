using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskManagerAPI.Controllers;
using TaskManagerAPI.Dtos;
using TaskManagerAPI.Exceptions;
using TaskManagerAPI.Models;
using TaskManagerAPI.Responses;
using TaskManagerAPI.Services;
using TaskManagerAPI.Tests.Support;

namespace TaskManagerAPI.Tests.Controllers;

public class TasksControllerTests : AutoFixtureTestBase
{
    private readonly Mock<ITaskService> _serviceMock = new();
    private readonly TasksController _sut;

    public TasksControllerTests()
    {
        _sut = new TasksController(_serviceMock.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsOkWithWrappedTasks()
    {
        var tasks = Fixture.CreateMany<TaskItem>(2).ToList();
        _serviceMock.Setup(s => s.GetAllTasksAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(tasks);

        var result = await _sut.GetAll(CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<ApiResponse<IReadOnlyList<TaskItem>>>(ok.Value);
        Assert.True(response.Success);
        Assert.Same(tasks, response.Data);
    }

    [Fact]
    public async Task Create_WithValidRequest_ReturnsCreatedWithWrappedTask()
    {
        var request = Fixture.Create<CreateTaskRequest>();
        var created = Fixture.Build<TaskItem>()
            .With(t => t.Title, request.Title)
            .With(t => t.IsComplete, false)
            .Create();
        _serviceMock.Setup(s => s.CreateTaskAsync(request.Title, It.IsAny<CancellationToken>()))
            .ReturnsAsync(created);

        var result = await _sut.Create(request, CancellationToken.None);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal(nameof(TasksController.GetAll), createdResult.ActionName);
        var response = Assert.IsType<ApiResponse<TaskItem>>(createdResult.Value);
        Assert.True(response.Success);
        Assert.Equal("Task created successfully.", response.Message);
        Assert.Same(created, response.Data);
    }

    [Fact]
    public async Task Delete_WithExistingId_ReturnsOkWithSuccessMessage()
    {
        var id = Fixture.CreatePositiveId();
        _serviceMock.Setup(s => s.DeleteTaskAsync(id, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var result = await _sut.Delete(id, CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<ApiResponse<object?>>(ok.Value);
        Assert.True(response.Success);
        Assert.Equal("Task deleted successfully.", response.Message);
        Assert.Null(response.Data);
        _serviceMock.Verify(s => s.DeleteTaskAsync(id, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Delete_WhenServiceThrowsNotFound_PropagatesException()
    {
        var id = Fixture.CreatePositiveId();
        _serviceMock.Setup(s => s.DeleteTaskAsync(id, It.IsAny<CancellationToken>()))
            .ThrowsAsync(new TaskNotFoundException(id));

        await Assert.ThrowsAsync<TaskNotFoundException>(() => _sut.Delete(id, CancellationToken.None));
    }
}
