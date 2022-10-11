export default function processor(options) {
  const { filePath, fileContent } = options

  console.log('\nProcessing file path:', filePath)

  return { charCount: fileContent.length }
}
