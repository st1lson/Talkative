using System;
using System.IO;
using TalkativeWebAPI.Dtos.Profile;

namespace TalkativeWebAPI.Services
{
    public class FileUploader
    {
        public string UploadImage(UploadProfileImageInput input)
        {
            string uniqueFileName = null;
            if (input.Image is not null)
            {
                uniqueFileName = Guid.NewGuid().ToString() + "_" + input.Image.FileName;
                string filePath = Path.Combine("images", uniqueFileName);
                using FileStream fileStream = new(filePath, FileMode.Create);
                input.Image.CopyTo(fileStream);
            }

            return uniqueFileName;
        }
    }
}
