type ButtonProps = {
  text: string;
  className: string;
  id: string;
  handleClick?: React.MouseEventHandler<HTMLButtonElement>;
  type: 'button' | 'submit' | 'reset' | undefined;
};

export default function Button({
  text,
  className,
  id,
  handleClick,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      id={id}
      className={className}
      onClick={handleClick && handleClick}
    >
      {text}
    </button>
  );
}
