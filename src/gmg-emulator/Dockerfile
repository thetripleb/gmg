FROM microsoft/dotnet:2.1-sdk AS build-env
WORKDIR /app

# copy csproj and restore as distinct layers
COPY *.sln .
COPY *.csproj .
RUN dotnet restore

# copy everything else and build app
COPY . .
RUN dotnet publish -c Release -o out --runtime linux-x64

FROM microsoft/dotnet:2.1-runtime
WORKDIR /app
COPY --from=build-env /app/out .

ENTRYPOINT ["./gmg-emulator"]