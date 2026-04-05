import { FileToken } from "./Chargoon.Didgah.Common5.UI.Models.Admin.Users.Signature.FileToken";
import { ImageTransformMatrix } from "./Chargoon.Didgah.Common.Domain.Dto.User.Signature.ImageTransformMatrix";

export class SignatureViewModel {
  FileToken: FileToken;
  FileName: string;
  FileExtension: string;
  Size: number;
  Comments: string;
  IsTempFile: boolean;
  ImageTransformMatrix: ImageTransformMatrix;
  TransformMatrixChanged: boolean;
}
