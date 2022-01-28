using HotChocolate.Types;

namespace TalkativeWebAPI.GraphQL.Groups
{
    public class AddGroupInputType : InputObjectType<AddGroupInput>
    {
        protected override void Configure(IInputObjectTypeDescriptor<AddGroupInput> descriptor)
        {
            descriptor.Description("Represents the input type for adding a group.");

            base.Configure(descriptor);
        }
    }
}
