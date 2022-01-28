using HotChocolate.Types;

namespace TalkativeWebAPI.GraphQL.Messages
{
    public class PutMessagePayloadType : ObjectType<PutMessagePayload>
    {
        protected override void Configure(IObjectTypeDescriptor<PutMessagePayload> descriptor)
        {
            descriptor.Description("Represents the payload type for updating a message");

            base.Configure(descriptor);
        }
    }
}
