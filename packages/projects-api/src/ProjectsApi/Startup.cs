using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Octokit.GraphQL;
using ProjectsApi.Services;

[assembly: FunctionsStartup(typeof(ProjectsApi.Startup))]
namespace ProjectsApi
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            var services = builder.Services;
            var config = new ConfigurationBuilder()
                .AddEnvironmentVariables()
                .AddKeyPerFile("/run/secrets", optional: true)
                .Build();

            services.AddSingleton<IProjectService, GithubProjectService>();
            services.AddSingleton<IConnection>(provider =>
            {
                var token = config.GetValue("GITHUB_TOKEN", "");

                var productInformation = new ProductHeaderValue("nvd.codes", "v2");
                var connection = new Connection(productInformation, token);
                return connection;
            });
        }
    }
}
