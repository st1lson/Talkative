using HotChocolate.Types;

namespace TalkativeWebAPI.GraphQL.Groups
{
    public class DeleteGroupInputType : InputObjectType<DeleteGroupInput>
    {
        protected override void Configure(IInputObjectTypeDescriptor<DeleteGroupInput> descriptor)
        {
            descriptor.Description("Represents the input type for deleting a group.");

            base.Configure(descriptor);
        }
    }
}
