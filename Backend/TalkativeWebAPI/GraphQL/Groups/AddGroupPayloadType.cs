using HotChocolate.Types;

namespace TalkativeWebAPI.GraphQL.Groups
{
    public class AddGroupPayloadType : ObjectType<AddGroupPayload>
    {
        protected override void Configure(IObjectTypeDescriptor<AddGroupPayload> descriptor)
        {
            descriptor.Description("Represents the payload type for adding a group.");

            base.Configure(descriptor);
        }
    }
}
