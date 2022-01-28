using HotChocolate.Types;
using TalkativeWebAPI.Models;

namespace TalkativeWebAPI.GraphQL.Groups
{
    public class GroupType : ObjectType<Group>
    {
        protected override void Configure(IObjectTypeDescriptor<Group> descriptor)
        {
            descriptor.Description("Represents a group.");

            base.Configure(descriptor);
        }
    }
}
