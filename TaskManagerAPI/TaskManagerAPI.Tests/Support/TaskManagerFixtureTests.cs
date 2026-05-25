using TaskManagerAPI.Dtos;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Tests.Support;

public class TaskManagerFixtureTests : AutoFixtureTestBase
{
    [Fact]
    public void Create_GeneratesTaskItemWithValidProperties()
    {
        var task = Fixture.Create<TaskItem>();

        Assert.True(task.Id > 0);
        Assert.False(string.IsNullOrWhiteSpace(task.Title));
    }

    [Fact]
    public void Create_GeneratesCreateTaskRequestWithTitle()
    {
        var request = Fixture.Create<CreateTaskRequest>();

        Assert.False(string.IsNullOrWhiteSpace(request.Title));
    }

    [Fact]
    public void CreateMany_GeneratesDistinctTaskItems()
    {
        var tasks = Fixture.CreateMany<TaskItem>(5).ToList();

        Assert.Equal(5, tasks.Count);
        Assert.Equal(5, tasks.Select(t => t.Id).Distinct().Count());
    }
}
