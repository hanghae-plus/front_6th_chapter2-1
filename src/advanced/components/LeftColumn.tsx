interface Props {
  children: React.ReactNode;
}

export const LeftColumn = ({ children }: Props) => {
  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      {children}
    </div>
  );
};
