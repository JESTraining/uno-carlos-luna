using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Dtos;
using TaskManagerAPI.Models;
using TaskManagerAPI.Responses;
using TaskManagerAPI.Services;

namespace TaskManagerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ApiControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<TaskItem>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<TaskItem>>>> GetAll(CancellationToken cancellationToken)
    {
        var tasks = await _taskService.GetAllTasksAsync(cancellationToken);
        return ApiOk(tasks);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<TaskItem>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object?>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<TaskItem>>> Create(
        [FromBody] CreateTaskRequest request,
        CancellationToken cancellationToken)
    {
        var task = await _taskService.CreateTaskAsync(request.Title, cancellationToken);
        return ApiCreated(nameof(GetAll), new { id = task.Id }, task, "Task created successfully.");
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(ApiResponse<object?>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object?>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object?>>> Delete(int id, CancellationToken cancellationToken)
    {
        await _taskService.DeleteTaskAsync(id, cancellationToken);
        return ApiOkMessage("Task deleted successfully.");
    }
}
