using System.ComponentModel.DataAnnotations;

namespace TaskManagerAPI.Dtos;

public class CreateTaskRequest
{
    [Required(ErrorMessage = "Title is required.")]
    [MinLength(1, ErrorMessage = "Title cannot be empty.")]
    [MaxLength(500, ErrorMessage = "Title cannot exceed 500 characters.")]
    public string Title { get; set; } = string.Empty;
}
