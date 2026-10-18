export function el<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text?: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

export function button(text: string, onClick: () => void, className = 'button button-primary'): HTMLButtonElement {
  const element = el('button', className, text);
  element.type = 'button';
  element.addEventListener('click', onClick);
  return element;
}

export function title(text: string): HTMLHeadingElement {
  const element = el('h1', 'screen-title', text);
  element.id = 'screen-title';
  element.tabIndex = -1;
  return element;
}

export function progress(completed: number, total: number): HTMLDivElement {
  const bar = el('div', 'progress');
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-label', '答题进度');
  bar.setAttribute('aria-valuemin', '0');
  bar.setAttribute('aria-valuemax', String(total));
  bar.setAttribute('aria-valuenow', String(completed));
  const fill = el('div', 'progress-fill');
  fill.style.width = `${completed / total * 100}%`;
  bar.append(fill);
  return bar;
}
