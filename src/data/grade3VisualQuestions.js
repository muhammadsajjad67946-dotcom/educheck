import sourceMarkdown from './EduCheck_170_Visual_MCQs.md?raw'
import { parseVisualMcqs } from '../utils/parseVisualMcqs'

export const grade3VisualQuestions = parseVisualMcqs(sourceMarkdown)
