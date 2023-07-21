import { Score } from '_types';
import React, { FC, useEffect, useMemo, useState } from 'react';

interface Props extends Score {
  title: string;
}

export const PercentageMetric: FC<Props> = ({
  percentage,
  fraction,
  title,
}) => {
  const targetPercentage = useMemo(() => percentage * 100, [percentage]);
  const [displayedPercentange, setDisplayedPercentage] = useState(
    percentage * 100
  );

  useEffect(() => {
    const step = targetPercentage > displayedPercentange ? 1 : -1;
    const interval = setInterval(() => {
      setDisplayedPercentage((prev) => {
        const next = prev + step;
        if (
          (step > 0 && next >= targetPercentage) ||
          (step < 0 && next <= targetPercentage)
        ) {
          clearInterval(interval);
          return targetPercentage;
        }
        return next;
      });
    }, 50);
  }, [displayedPercentange, targetPercentage]);

  const percentageDispayed = useMemo(
    () => displayedPercentange?.toFixed(0),
    [displayedPercentange]
  );

  return (
    <div className="stats shadow">
      <div className="stat">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{percentageDispayed}%</div>
        <div className="stat-desc">{fraction}</div>
        <div
          className="h-2 rounded-full transition-all duration-500 stat-desc bg-primary"
          style={{ width: `${targetPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

interface BigNumberProps {
  title: string;
  value: number;
  className?: string;
}

export const BigNumber: FC<BigNumberProps> = ({ title, value, className }) => {
  const classNameMemo = useMemo(() => `stat ${className}`, [className]);

  return (
    <div className={classNameMemo}>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
};
