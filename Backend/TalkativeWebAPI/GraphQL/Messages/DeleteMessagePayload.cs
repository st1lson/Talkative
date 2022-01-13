using TalkativeWebAPI.Dtos;

namespace TalkativeWebAPI.GraphQL.Messages
{
    public record DeleteMessagePayload(MessageDto Message);
}