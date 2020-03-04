using System.Collections.Generic;
using System.Threading.Tasks;
using ProjectsApi.Domain;

namespace ProjectsApi.Services
{
    public interface IProjectService
    {
        Task<Commit> GetLatestCommit();
        Task<IReadOnlyList<Project>> GetLastest(int take);
    }
}
