using AutoFixture;
using TaskManagerAPI.Dtos;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Tests.Support;

public static class TaskManagerFixture
{
    public static IFixture Create()
    {
        var fixture = new Fixture();
        fixture.Register(CreateTaskItem);
        fixture.Customize<CreateTaskRequest>(composer => composer
            .With(r => r.Title, () => CreateTitle(fixture)));
        return fixture;

        TaskItem CreateTaskItem() => new()
        {
            Id = CreatePositiveId(fixture),
            Title = CreateTitle(fixture),
            IsComplete = fixture.Create<bool>()
        };
    }

    public static string CreateTitle(this IFixture fixture) =>
        fixture.Create<string>().Trim();

    public static int CreatePositiveId(this IFixture fixture) =>
        Math.Abs(fixture.Create<int>()) + 1;

    public static int CreateNonExistentId(this IFixture fixture) =>
        int.MaxValue - fixture.Create<int>() % 1000;
}
