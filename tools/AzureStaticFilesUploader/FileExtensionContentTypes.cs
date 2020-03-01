using System;
using System.Collections.Generic;

namespace AzureStaticFilesUploader
{
    public class FileExtensionContentTypes
    {
        public IDictionary<string, string> Mappings { get; private set; }
        public FileExtensionContentTypes()
        {
            Mappings = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { ".js", "application/javascript" },
                { ".json", "application/json" },
                { ".css", "text/css" },
                { ".htm", "text/html" },
                { ".html", "text/html" },
                { ".xml", "text/xml" },
            };
        }

        public bool TryGetContentType(string subpath, out string contentType)
        {
            string extension = GetExtension(subpath);
            if (extension == null)
            {
                contentType = null;
                return false;
            }
            return Mappings.TryGetValue(extension, out contentType);
        }

        private static string GetExtension(string path)
        {
            if (string.IsNullOrWhiteSpace(path))
            {
                return null;
            }

            int index = path.LastIndexOf('.');
            if (index < 0)
            {
                return null;
            }

            return path.Substring(index);
        }
    }
}
