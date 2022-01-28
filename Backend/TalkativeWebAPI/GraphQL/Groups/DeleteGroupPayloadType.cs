using HotChocolate.Types;

namespace TalkativeWebAPI.GraphQL.Groups
{
    public class DeleteGroupPayloadType : ObjectType<DeleteGroupPayload>
    {
        protected override void Configure(IObjectTypeDescriptor<DeleteGroupPayload> descriptor)
        {
            descriptor.Description("Represents the payload type for deleting a group");

            base.Configure(descriptor);
        }
    }
}
