interface Props {
  left: React.ReactNode;
  right: React.ReactNode;
}

export default function MainLayout({ left, right }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      {left}
      {right}
    </div>
  );
}
