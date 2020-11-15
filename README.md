# nvd.codes

This is my blog. There are many like it, but this one is mine.

## Getting Started
There are a couple of dependencies needed in order to run and deploy this blog
- node 12.x
- python 3.7
- pipenv
- pulumi

It might be easier to install nvm pyenv to work with multiple versions of these runtimes

### Run it locally

Install all required dependencies
```
make install
```

The following command will start up the frontend on http://localhost:3000 and the api on http://localhost:7071.
```
make dev
```


## Project Structure

- `_posts`: Contains all my blog posts grouped per year
- `apps`: Every app needed to run my blog. 
- `libs`: Shared libraries used to support any apps.
- `infra`: Pulumi project to spin up infrastructure to host my blog and deploy new version to production.
