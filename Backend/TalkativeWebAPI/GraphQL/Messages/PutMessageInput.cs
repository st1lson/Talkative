namespace TalkativeWebAPI.GraphQL.Messages
{
    public record PutMessageInput(int GroupId, int Id, string Text);
}