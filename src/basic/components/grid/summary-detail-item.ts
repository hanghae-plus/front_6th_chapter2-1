import { html } from '../../utils/html';

interface Props {
  name: string;
  value: string;
}

export function SummaryDetailItem({ name, value }: Props) {
  return html`
    <div class="flex justify-between text-xs tracking-wide text-gray-400">
      <span>${name}</span>
      <span>${value}</span>
    </div>
  `;
}
