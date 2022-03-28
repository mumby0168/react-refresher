FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

# Install Node
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install --assume-yes nodejs

# Build Project
COPY ./ ./
RUN sed -i -e  "s@https://localhost:44489/@https://rtodo.bemby.cloud/@g" "src/App/ClientApp/src/auth/msal.ts"
RUN dotnet restore "TodoApp.sln"

WORKDIR "src/App"

FROM build AS publish
RUN dotnet publish "App.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "App.dll"]