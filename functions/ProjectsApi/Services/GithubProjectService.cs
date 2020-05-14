using ProjectsApi.Domain;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Octokit.GraphQL;
using GraphQlModel = Octokit.GraphQL.Model;

namespace ProjectsApi.Services
{
    public class GithubProjectService : IProjectService
    {
        private readonly IConnection _connection;

        public GithubProjectService(IConnection connection)
        {
            _connection = connection;
        }

        public async Task<Commit> GetLatestCommit()
        {
            var query = new Query()
                .Viewer
                .Repositories(
                    first: 1,
                    isFork: false,
                    privacy: GraphQlModel.RepositoryPrivacy.Public,
                    orderBy: new GraphQlModel.RepositoryOrder
                    {
                        Field = GraphQlModel.RepositoryOrderField.PushedAt,
                        Direction = GraphQlModel.OrderDirection.Desc,
                    }
                )
                .Nodes
                .Select(
                    r => r.Object("master", null)
                        .Cast<GraphQlModel.Commit>()
                        .Select(g => g.History(1, null, null, null, null, null, null, null))
                        .Select(h => h.Nodes)
                        .Select(c => new Commit
                        {
                            Id = c.Oid,
                            Url = c.CommitUrl,
                            Message = c.Message,
                            MessageHeadline = c.MessageHeadline,
                            PushedDate = c.PushedDate,
                            RepositoryName = c.Repository.Name
                        })
                        .ToList()
                        .FirstOrDefault()
                );

            var result = await _connection.Run(query);
            return result.FirstOrDefault();
        }

        public async Task<IReadOnlyList<Project>> GetLastest(int take)
        {
            var query = new Query()
                .Viewer
                .Repositories(
                    first: Variable.Var("take"),
                    isFork: false,
                    affiliations: new List<GraphQlModel.RepositoryAffiliation?>(){ GraphQlModel.RepositoryAffiliation.Owner },
                    privacy: GraphQlModel.RepositoryPrivacy.Public,
                    orderBy: new GraphQlModel.RepositoryOrder
                    {
                        Field = GraphQlModel.RepositoryOrderField.UpdatedAt,
                        Direction = GraphQlModel.OrderDirection.Desc,
                    }
                )
                .Nodes
                .Select(r => new Project
                {
                    Id = r.Id.Value,
                    Name = r.Name,
                    NameWithOwner = r.NameWithOwner,
                    Description = r.Description ?? "",
                    UpdatedAt = r.UpdatedAt,
                    Stars = r.Stargazers(null, null, null, null, null).TotalCount,
                    Url = r.Url,
                    PrimaryLanguage = new ProjectLanguage(
                        r.Select(p => p.PrimaryLanguage != null ? p.PrimaryLanguage.Name : null).SingleOrDefault(),
                        r.Select(p => p.PrimaryLanguage != null ? p.PrimaryLanguage.Color : null).SingleOrDefault()
                    )
                });

            var variables = new Dictionary<string, object>
            {
                { "take", take },
            };

            var result = await _connection.Run(query.Compile(), variables);
            return result.ToList();
        }
    }
}
