using System.Collections.Generic;
using TalkativeWebAPI.Dtos;

namespace TalkativeWebAPI.GraphQL.Messages
{
    public record OnMessagesChange(IEnumerable<MessageDto> Messages);
}
