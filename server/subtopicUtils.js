export function validateSubtopicSelection({ topicId, subtopicId, topics = [] }) {
  const safeTopicId = Number(topicId)
  const safeSubtopicId = subtopicId == null || subtopicId === '' ? null : Number(subtopicId)

  if (!Number.isInteger(safeTopicId) || safeTopicId <= 0) {
    return { valid: false, error: 'A valid topic is required.', parentTopicId: null, subtopicId: null }
  }

  const selectedTopic = topics.find((topic) => Number(topic.id) === safeTopicId)
  if (!selectedTopic) {
    return { valid: false, error: 'Selected topic was not found.', parentTopicId: null, subtopicId: null }
  }

  const parentTopicId = Number(selectedTopic.parentTopicId ?? safeTopicId)

  if (safeSubtopicId == null) {
    return { valid: true, error: '', parentTopicId, subtopicId: null }
  }

  const selectedSubtopic = topics.find((topic) => Number(topic.id) === safeSubtopicId)
  if (!selectedSubtopic) {
    return { valid: false, error: 'Selected subtopic was not found.', parentTopicId, subtopicId: null }
  }

  const subtopicParentId = Number(selectedSubtopic.parentTopicId ?? selectedSubtopic.id)
  if (subtopicParentId !== safeTopicId) {
    return {
      valid: false,
      error: `Selected subtopic does not belong to the chosen topic: ${selectedTopic.name}.`,
      parentTopicId,
      subtopicId: null,
    }
  }

  return { valid: true, error: '', parentTopicId, subtopicId: safeSubtopicId }
}
