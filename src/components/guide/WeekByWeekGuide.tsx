import React from 'react';
import { PregnancyGuide } from './PregnancyGuide';

interface WeekByWeekGuideProps {
  onClose?: () => void;
  initialWeek?: number;
}

/**
 * WeekByWeekGuide renders the full PregnancyGuide component for seamless backward compatibility.
 */
export const WeekByWeekGuide: React.FC<WeekByWeekGuideProps> = ({
  onClose,
  initialWeek,
}) => {
  return <PregnancyGuide onClose={onClose} initialWeek={initialWeek} />;
};

export { PregnancyGuide };
export default PregnancyGuide;
