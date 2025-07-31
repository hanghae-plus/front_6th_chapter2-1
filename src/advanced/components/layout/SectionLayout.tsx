import { PropsWithChildren, ReactElement } from 'react';

export default function SectionLayout({ children }: PropsWithChildren): ReactElement {
  return <div className="bg-white border border-gray-200 p-8 overflow-y-auto">{children}</div>;
}
