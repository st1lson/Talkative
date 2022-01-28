using HotChocolate.Types;

namespace TalkativeWebAPI.GraphQL.Groups
{
    public class PutGroupInputType : InputObjectType<PutGroupInput>
    {
        protected override void Configure(IInputObjectTypeDescriptor<PutGroupInput> descriptor)
        {
            descriptor.Description("Represents the input type for updating a group.");

            base.Configure(descriptor);
        }
    }
}
