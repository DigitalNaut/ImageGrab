export function singularIf(exp: boolean, singular = "", plural = "s") {
  return exp ? singular : plural;
}
