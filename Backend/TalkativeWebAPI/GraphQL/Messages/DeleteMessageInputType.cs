using HotChocolate.Types;

namespace TalkativeWebAPI.GraphQL.Messages
{
    public class DeleteMessageInputType : InputObjectType<DeleteMessageInput>
    {
        protected override void Configure(IInputObjectTypeDescriptor<DeleteMessageInput> descriptor)
        {
            descriptor.Description("Represents the input type for deleting a message.");

            base.Configure(descriptor);
        }
    }
}
