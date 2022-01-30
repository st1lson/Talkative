using System;

namespace TalkativeWebAPI.Dtos
{
    public class MessageDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; }
        public int GroupId { get; set; }
        public string UserName { get; set; }
    }
}
