using HotChocolate.Types;

namespace TalkativeWebAPI.GraphQL.Messages
{
    public class DeleteMessagePayloadType : ObjectType<DeleteMessagePayload>
    {
        protected override void Configure(IObjectTypeDescriptor<DeleteMessagePayload> descriptor)
        {
            descriptor.Description("Represents the payload type for deleting a message.");

            base.Configure(descriptor);
        }
    }
}
