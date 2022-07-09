using System;
using System.IO;
using System.Threading.Tasks;
using TalkativeWebAPI.Dtos.Profile;

namespace TalkativeWebAPI.Services
{
    public class FileUploader
    {
        public async Task<string> UploadImage(UploadProfileImageInput input)
        {
            string uniqueFileName = null;
            if (input.Image is not null)
            {
                uniqueFileName = Guid.NewGuid().ToString() + "_" + input.Image.FileName;
                string filePath = Path.Combine("images", uniqueFileName);
                using FileStream fileStream = File.Create(filePath);
                try
                {
                    await input.Image.CopyToAsync(fileStream);
                }
                catch (Exception e)
                {
                    Console.WriteLine(e.Message);
                }
            }

            return uniqueFileName;
        }
    }
}
