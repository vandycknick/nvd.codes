using System.Collections.Generic;
using Newtonsoft.Json;

namespace ProjectsApi.Domain
{
    public class Project
    {
        public string Id { get; set; }
        public string Name { get; set; }
        [JsonProperty("full_name")]
        public string NameWithOwner { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }
        public ProjectLanguage PrimaryLanguage { get; set; }
        public int Stars { get; set; }
        public List<string> Languages { get; set; }
    }
}
