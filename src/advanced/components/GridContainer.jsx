export const GridContainer = ({ children }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      {children}
    </div>
  );
};
