namespace ProjectsApi.Domain
{
    public class ProjectLanguage
    {
        public static ProjectLanguage Empty = new ProjectLanguage(@"¯\_(ツ)_/¯", "#ffffff");
        public ProjectLanguage(string name, string color)
        {
            Name = name ?? Empty.Name;
            Color = color ?? Empty.Color;
        }

        public string Name { get; set; }
        public string Color { get; set; }
    }
}
