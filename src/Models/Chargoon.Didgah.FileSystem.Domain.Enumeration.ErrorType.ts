export enum ErrorType {
  AccessIsDenied = 1,
  RepositoryDatabaseValidationFailed = 2,
  DuplicateSoftwareRepository = 3,
  RepositoryInUse = 4,
  FileReferenceNotFound = 5,
  InvalidFileToken = 6,
  RepositoryIsNotUniqueInDatabase = 7,
  EstablishConnectionFailed = 8,
  DataBaseIsNotQueriable = 9,
  FileUploadWithMaliciousIntension = 10,
  FileSizeLargerThanLimit = 11,
}
