// Sub-categories shown as chips on course cards (HTML & CSS, JavaScript, Python...).
// Admin-managed `technologies` wins; hard-coded `children` is only a fallback for static data.
export function getCourseTags(course: any): string[] {
  const source = Array.isArray(course?.technologies)
    ? course.technologies
    : course?.hasChildren && Array.isArray(course?.children)
      ? course.children
      : []

  return source.filter((item: unknown): item is string => typeof item === "string" && item.trim() !== "")
}
