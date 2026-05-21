using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Responses;

namespace TaskManagerAPI.Controllers;

public abstract class ApiControllerBase : ControllerBase
{
    protected ActionResult<ApiResponse<T>> ApiOk<T>(T data, string? message = null) =>
        Ok(ApiResponse.Ok(data, message));

    protected ActionResult<ApiResponse<T>> ApiCreated<T>(
        string actionName,
        object? routeValues,
        T data,
        string? message = null) =>
        CreatedAtAction(actionName, routeValues, ApiResponse.Ok(data, message));

    protected ActionResult<ApiResponse<object?>> ApiOkMessage(string message) =>
        Ok(ApiResponse.Ok<object?>(null, message));
}
