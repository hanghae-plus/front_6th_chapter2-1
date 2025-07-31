import { commaizeNumber } from 'shared/utils';

interface SubtotalSectionProps {
  subtotal: number;
}

export function SubtotalSection({ subtotal }: SubtotalSectionProps) {
  if (subtotal <= 0) return null;

  return (
    <>
      <div className="border-t border-white/10 my-3"></div>
      <div className="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩{commaizeNumber(subtotal)}</span>
      </div>
    </>
  );
}
