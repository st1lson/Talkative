using HotChocolate.Types;

namespace TalkativeWebAPI.GraphQL.Messages
{
    public class AddMessagePayloadType : ObjectType<AddMessagePayload>
    {
        protected override void Configure(IObjectTypeDescriptor<AddMessagePayload> descriptor)
        {
            descriptor.Description("Represents the payload type for adding a message.");

            base.Configure(descriptor);
        }
    }
}
