using HotChocolate.Types;

namespace TalkativeWebAPI.GraphQL.Groups
{
    public class PutGroupPayloadType : ObjectType<PutGroupPayload>
    {
        protected override void Configure(IObjectTypeDescriptor<PutGroupPayload> descriptor)
        {
            descriptor.Description("Represents the payload type for updating a group.");

            base.Configure(descriptor);
        }
    }
}
