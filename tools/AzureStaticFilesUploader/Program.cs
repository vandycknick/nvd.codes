using System;
using System.CommandLine;
using System.CommandLine.Invocation;
using System.CommandLine.IO;
using System.IO;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;

namespace AzureStaticFilesUploader
{
    class Program
    {
        private const string MAX_AGE = "public, max-age=31536000";
        private const string NO_CACHE = "no-cache";

        static int Main(string[] args)
        {
            var rootCommand = new RootCommand("Azure blob storage file uploader")
            {
                new Option(
                    new string[] { "--cwd" },
                    "Directory of files to upload")
                {
                    Argument = new Argument<DirectoryInfo>
                    {
                        Arity = ArgumentArity.ExactlyOne,
                    }

                },
                new Option(
                    new string[] { "--container" },
                    "Blob container name")
                {
                    Argument = new Argument<string>(() => "$web")
                    {
                        Arity = ArgumentArity.ZeroOrOne
                    }
                },
                new Option(
                    new string[] { "--connection-string" },
                    "Storage connection string")
                {
                    Argument = new Argument<string>(() => string.Empty)
                    {
                        Arity = ArgumentArity.ZeroOrOne
                    }
                }
            };

            rootCommand.Handler = CommandHandler.Create<DirectoryInfo, string, string, IConsole>(Run);
            return rootCommand.Invoke(args);
        }

        static int Run(DirectoryInfo cwd, string container, string connectionString, IConsole console)
        {
            if (cwd == null || !cwd.Exists)
            {
                console.Error.WriteLine("Given directory does not exist!");
                return 1;
            }

            if (string.IsNullOrEmpty(connectionString))
            {
                if (console.IsInputRedirected)
                {
                    connectionString = "";
                    string data;
                    while ((data = Console.ReadLine()) != null)
                    {
                        connectionString += data;
                    }
                }
                else
                {
                    console.Error.WriteLine("No connectionString given!");
                    return 1;
                }
            }

            var files = cwd.EnumerateFiles("*.*", SearchOption.AllDirectories);

            var fileExtensions = new FileExtensionContentTypes();

            CloudStorageAccount.TryParse(connectionString, out var account);
            var blobclient = account.CreateCloudBlobClient();
            var blobContainer = blobclient.GetContainerReference(container);
            blobContainer.CreateIfNotExistsAsync().Wait();

            foreach (var file in files)
            {
                var relative = Path.GetRelativePath(cwd.FullName, file.FullName);
                var blob = blobContainer.GetBlockBlobReference(relative);

                console.Out.WriteLine($"Uploading file: {file}");
                blob.UploadFromFile(file.FullName);

                if (fileExtensions.TryGetContentType(relative, out var contentType))
                {

                    blob.Properties.ContentType = contentType;

                    if (contentType == "application/javascript" || contentType == "text/css")
                    {

                        blob.Properties.CacheControl = MAX_AGE;
                    }
                    else
                    {
                        blob.Properties.CacheControl = NO_CACHE;
                    }
                }

                blob.SetProperties();
            }

            return 0;
        }
    }
}
