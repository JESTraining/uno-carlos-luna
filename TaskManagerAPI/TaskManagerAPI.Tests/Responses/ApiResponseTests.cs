using TaskManagerAPI.Responses;

namespace TaskManagerAPI.Tests.Responses;

public class ApiResponseTests
{
    [Fact]
    public void Ok_SetsSuccessAndData()
    {
        var response = ApiResponse.Ok("payload", "Done");

        Assert.True(response.Success);
        Assert.Equal("payload", response.Data);
        Assert.Equal("Done", response.Message);
        Assert.Null(response.Errors);
    }

    [Fact]
    public void Fail_SetsSuccessFalseWithErrors()
    {
        var response = ApiResponse.Fail("Failed", ["Error one"]);

        Assert.False(response.Success);
        Assert.Equal("Failed", response.Message);
        Assert.Single(response.Errors!);
        Assert.Null(response.Data);
    }
}
