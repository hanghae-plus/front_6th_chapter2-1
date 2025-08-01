import { LeftColumn } from './LeftColumn';
import { RightColumn } from './RightColumn';

export const GridContainer = () => (
  <div className='grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden'>
    <LeftColumn />
    <RightColumn />
  </div>
);
