import { type GetSignedUrlConfig, Storage } from '@google-cloud/storage'

const bucketName = process.env.UPLOAD_BUCKET_NAME as string

// Creates a client
const storage = new Storage()

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function generateV4UploadSignedUrl (fileName: string, contentType: string) {
  // These options will allow temporary uploading of the file with outgoing
  // Content-Type: application/octet-stream header.
  const options: GetSignedUrlConfig = {
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType
  }

  // Get a v4 signed URL for uploading file
  const [url] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(options)

  // console.log('Generated PUT signed URL:')
  // console.log(url)
  // console.log('You can use this URL with any user agent, for example:')
  // console.log(
  //   "curl -X PUT -H 'Content-Type: image/png' " +
  //     `--upload-file my-file '${url}'`
  // )
  return url
}
