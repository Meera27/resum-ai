import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import * as mammoth from 'mammoth'

pdfjs.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.mjs'

export async function parseResume(file: Buffer, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(file),
      useSystemFonts: true
    })
    const pdf = await loadingTask.promise
    let fullText = ''
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(' ')
      fullText += pageText + '\n'
    }
    
    return fullText
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    const result = await mammoth.extractRawText({ buffer: file })
    return result.value
  } else {
    throw new Error('Unsupported file type. Please upload PDF or DOCX.')
  }
}
