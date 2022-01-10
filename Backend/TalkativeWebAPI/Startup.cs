using GraphQL.Server.Ui.Voyager;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using TalkativeWebAPI.Data.DbContexts;
using TalkativeWebAPI.GraphQL;
using TalkativeWebAPI.GraphQL.ApplicationUsers;
using TalkativeWebAPI.GraphQL.Messages;
using TalkativeWebAPI.Models;
using TalkativeWebAPI.Services;

namespace TalkativeWebAPI
{
    public class Startup
    {
        public IConfiguration Configuration { get; set; }
        public IWebHostEnvironment Environment { get; set; }

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddPooledDbContextFactory<MessagesDbContext>(options =>
                options.UseSqlServer(Configuration["DatabaseConnectionString"]));

            services.AddPooledDbContextFactory<RefreshTokensDbContext>(options => 
                options.UseSqlServer(Configuration["DatabaseConnectionString"]));

            services.AddScoped<JwtTokenCreator>();

            services.AddScoped<JwtRefreshTokenHandler>();

            services.AddScoped(provider =>
                provider.GetRequiredService<IDbContextFactory<MessagesDbContext>>().CreateDbContext());

            services
                .AddIdentity<ApplicationUser, IdentityRole>(options =>
                {
                    options.Password.RequireDigit = true;
                    options.Password.RequireLowercase = true;
                    options.Password.RequireNonAlphanumeric = true;
                    options.Password.RequireUppercase = true;
                    options.Password.RequiredLength = 6;
                    options.Password.RequiredUniqueChars = 1;
                })
                .AddEntityFrameworkStores<MessagesDbContext>();

            string signingKeyPhrase = Configuration["SigningKeyPhrase"];
            SymmetricSecurityKey signingKey = new(Encoding.UTF8.GetBytes(signingKeyPhrase));

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = true;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        IssuerSigningKey = signingKey,
                        ValidateAudience = false,
                        ValidateIssuer = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("Auth", policy => policy.RequireClaim(JwtRegisteredClaimNames.Typ, "Auth"));
                options.AddPolicy("Refresh", policy => policy.RequireClaim(JwtRegisteredClaimNames.Typ, "Refresh"));
            });

            services.AddHttpContextAccessor();

            services.AddControllers();

            services
                .AddGraphQLServer()
                .AddQueryType<Query>()
                .AddMutationType<Mutation>()
                .AddSubscriptionType<Subscription>()
                .AddType<ApplicationUserType>()
                .AddType<MessageType>()
                .AddFiltering()
                .AddSorting()
                .AddAuthorization();

            services.AddOptions();
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseWebSockets();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseGraphQLVoyager(new VoyagerOptions()
            {
                GraphQLEndPoint = "/graphql"
            }, "/graphql-voyager");

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGraphQL();
                endpoints.MapControllers();
            });
        }
    }
}
