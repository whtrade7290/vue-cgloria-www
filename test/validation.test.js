import { VALIDATION_TITLE, VALIDATION_FILES } from '@/utils/validation'
import { expect, it, vi, beforeEach } from 'vitest'
import Swal from 'sweetalert2'

it('should return true if title is empty', () => {
  expect(VALIDATION_TITLE('')).toBe(true)
})

it('should return true if title is empty', () => {
  expect(VALIDATION_TITLE('test')).toBe(false)
})

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn() }
}))

beforeEach(() => {
  vi.clearAllMocks()
})

it('calls Swal.fire when title is empty', () => {
  VALIDATION_TITLE('')
  expect(Swal.fire).toHaveBeenCalledWith({
    title: '제목을 입력해주세요.',
    icon: 'warning'
  })
})

it('does not call Swal.fire when title is not empty', () => {
  VALIDATION_TITLE('Hello')
  expect(Swal.fire).not.toHaveBeenCalled()
})

const createFile = (size, type) => ({
  size,
  type
})

it('정상', () => {
  const files = [createFile(1024, 'image/png')]
  const newFiles = [createFile(1024, 'image/jpeg')]

  expect(VALIDATION_FILES(files, newFiles)).toBe(true)
  expect(Swal.fire).not.toHaveBeenCalled()
})

it('파일 6개 불가', () => {
  const files = Array(6).fill(createFile(1024, 'image/png'))
  const newFiles = [createFile(3 * 1024 * 1024, 'image/jpeg')]

  expect(VALIDATION_FILES(files, newFiles)).toBe(false)
  expect(Swal.fire).toHaveBeenCalledWith({
    title: '업로드는 최대 6개까지 가능합니다.',
    icon: 'warning'
  })
})

it('사이즈5mb초과', () => {
  const files = []
  const newFiles = [createFile(6 * 1024 * 1024, 'image/png')]

  expect(VALIDATION_FILES(files, newFiles)).toBe(false)
  expect(Swal.fire).toHaveBeenCalledWith({
    title: '업로드 가능한 파일 사이즈는 5MB까지입니다.',
    icon: 'warning'
  })
})

it('HEIF 허용', () => {
  const files = []
  const newFiles = [createFile(1024, 'image/heic')]

  expect(VALIDATION_FILES(files, newFiles)).toBe(true)
})

it('파일 형식체크', () => {
  const files = [createFile(1024, 'zip')]
  const newFiles = [createFile(1024, 'zip')]

  expect(VALIDATION_FILES(files, newFiles)).toBe(false)
  expect(Swal.fire).toHaveBeenCalledWith({
    title: '업로드 가능한 파일 형식은 JPEG, PNG, PDF, HEIF입니다.',
    icon: 'warning'
  })
})
