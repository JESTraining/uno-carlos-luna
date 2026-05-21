using AutoFixture;

namespace TaskManagerAPI.Tests.Support;

public abstract class AutoFixtureTestBase
{
    protected IFixture Fixture { get; } = TaskManagerFixture.Create();
}
