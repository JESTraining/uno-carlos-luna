namespace TaskManagerAPI.Responses;

public class ApiResponse<T>
{
    public bool Success { get; init; }
    public string? Message { get; init; }
    public T? Data { get; init; }
    public IReadOnlyList<string>? Errors { get; init; }

    public static ApiResponse<T> Ok(T data, string? message = null) => new()
    {
        Success = true,
        Message = message,
        Data = data
    };

    public static ApiResponse<T> Fail(
        string message,
        IReadOnlyList<string>? errors = null) => new()
    {
        Success = false,
        Message = message,
        Errors = errors
    };
}

public static class ApiResponse
{
    public static ApiResponse<T> Ok<T>(T data, string? message = null) =>
        ApiResponse<T>.Ok(data, message);

    public static ApiResponse<object?> Fail(
        string message,
        IReadOnlyList<string>? errors = null) =>
        ApiResponse<object?>.Fail(message, errors);
}
