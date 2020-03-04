FROM mcr.microsoft.com/dotnet/core/sdk:3.1

ENV FUNCTIONS_CORE_TOOLS_TELEMETRY_OPTOUT=1

RUN apt update
RUN apt install -y wget gpg

RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg  && \
    mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/ && \
    wget -q https://packages.microsoft.com/config/debian/9/prod.list && \
    mv prod.list /etc/apt/sources.list.d/microsoft-prod.list && \
    chown root:root /etc/apt/trusted.gpg.d/microsoft.asc.gpg && \
    chown root:root /etc/apt/sources.list.d/microsoft-prod.list

RUN apt update
RUN apt install -y azure-functions-core-tools-3 entr

WORKDIR /app

CMD func start
