using System;

namespace ProjectsApi.Domain
{
    public class Commit
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public string Message { get; set; }
        public string MessageHeadline { get; set; }
        public DateTimeOffset? PushedDate { get; set; }
        public string RepositoryName { get; set; }
    }
}
