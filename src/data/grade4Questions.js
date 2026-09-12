import source from './Grade4_Math_MCQs_Merged_Q1_to_Q250.txt?raw'
import { parseGrade4Mcqs } from '../utils/parseGrade4Mcqs'

export const grade4Questions = parseGrade4Mcqs(source)
