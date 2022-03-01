namespace TalkativeWebAPI.Dtos
{
    public class GroupDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public MessageDto LastMessage { get; set; }
    }
}