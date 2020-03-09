using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ProjectsApi.Services;

namespace ProjectsApi.Functions
{
    public class Activities
    {
        private readonly IProjectService _projectService;

        public Activities(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [FunctionName("Activities")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "project/activities")] HttpRequest req,
            ILogger log)
        {
            var commit = await _projectService.GetLatestCommit();
            var projects = await _projectService.GetLastest(6);

            log.LogInformation("Returned projects {count}", projects.Count);

            return new JsonResult(new
            {
                LatestCommit = commit,
                Projects = projects,
                Hello = "world",
            });
        }
    }
}
