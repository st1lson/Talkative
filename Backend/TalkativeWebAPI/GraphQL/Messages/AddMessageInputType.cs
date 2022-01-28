using HotChocolate.Types;

namespace TalkativeWebAPI.GraphQL.Messages
{
    public class AddMessageInputType : InputObjectType<AddMessageInput>
    {
        protected override void Configure(IInputObjectTypeDescriptor<AddMessageInput> descriptor)
        {
            descriptor.Description("Represents the input type for adding a message.");

            base.Configure(descriptor);
        }
    }
}
