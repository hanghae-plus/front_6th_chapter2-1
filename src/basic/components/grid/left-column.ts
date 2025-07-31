import { appendChildren } from '../../utils/append-children';

interface Props {
  children: HTMLElement[];
}

export const LeftColumn = ({ children }: Props) => {
  const leftColumn = document.createElement('div');
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

  appendChildren(leftColumn, children);

  return leftColumn;
};
