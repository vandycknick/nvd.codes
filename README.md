# nvd.codes

This is my blog. There are many like it, but this one is mine.

## Getting Started

There are a couple of dependencies needed in order to run and deploy this blog

- node 16.x
- terraform

### Run it locally

Get all dependencies installed with:

```
make setup
```

Running `make dev` will start up a dev server available on `http://localhost:7000`

## Project Structure

- `_posts`: Contains all my blog posts grouped per year
- `apps`: Every app needed to run my blog.
- `libs`: Shared libraries used to support any apps.
- `infra`: Terraform code that manages the underlying infrastructure.
