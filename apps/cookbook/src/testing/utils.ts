export function getProps(element: HTMLElement) {
  const rawProps = element.getAttribute('data-props');
  return rawProps ? JSON.parse(rawProps) : null;
}
