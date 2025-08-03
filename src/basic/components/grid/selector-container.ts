import { appendChildren } from '../../utils/append-children';

interface Props {
  children: HTMLElement[];
}

export const SelectorContainer = ({ children }: Props) => {
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  appendChildren(selectorContainer, children);

  return selectorContainer;
};
