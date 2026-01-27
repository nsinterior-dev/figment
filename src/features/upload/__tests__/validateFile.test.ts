import { validateFile } from '../utils/validateFile'

describe('validateFile', () => {
  it('accepts valid PNG file', () => {
    const file = new File([''], 'test.png', { type: 'image/png' })
    const result = validateFile(file)
    expect(result.valid).toBe(true)
  })

  it('rejects invalid file type', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' })
    const result = validateFile(file)
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error).toContain('image')
    }
  })

  it('rejects file over 10MB', () => {
    // Create a fake large file
    const largeContent = new Array(11 * 1024 * 1024).fill('a').join('')
    const file = new File([largeContent], 'big.png', { type: 'image/png' })
    const result = validateFile(file)
    expect(result.valid).toBe(false)
  })
})
