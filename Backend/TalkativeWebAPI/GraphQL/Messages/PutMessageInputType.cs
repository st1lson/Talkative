using HotChocolate.Types;

namespace TalkativeWebAPI.GraphQL.Messages
{
    public class PutMessageInputType : InputObjectType<PutMessageInput>
    {
        protected override void Configure(IInputObjectTypeDescriptor<PutMessageInput> descriptor)
        {
            descriptor.Description("Represents the input type for updating a message.");

            base.Configure(descriptor);
        }
    }
}
