# Step 1 - Build the application
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["DotnetPostgresApi.csproj", "."]
RUN dotnet restore "DotnetPostgresApi.csproj"

# Copy the rest of the code
COPY . .
RUN dotnet build "DotnetPostgresApi.csproj" -c Release -o /app/build

# Step 2 - Publish the application
FROM build AS publish
RUN dotnet publish "DotnetPostgresApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

#Step 3 - Create the final image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DotnetPostgresApi.dll"]