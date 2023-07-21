import { BigNumber, PercentageMetric } from 'components';
import React, { FC, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  selectAttemptedScore,
  selectCorrectCount,
  selectIncorrectCount,
  selectNotScoredCount,
  selectSkippedCount,
  selectSuccessOfAttemptedScore,
} from 'store';
import Chart from 'chart.js/auto';

const DonutChart = ({ data }: any) => {
  const canvasRef = useRef<any>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current?.destroy?.(); // Destroy the existing chart
    }

    const ctx = canvasRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data,
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        animation: {
          animateRotate: false,
          animateScale: false,
          easing: 'easeInOutQuart',
          duration: 1000,
        },

        // cutout: '80%',
      },
    });

    // Clean up
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current?.destroy?.(); // Destroy the chart instance when the component unmounts
      }
    };
  }, [data]); // Re-run the effect if the 'data' prop changes

  return <canvas ref={canvasRef} className="p-4" />;
};

export const MetricsContainer: FC = () => {
  const successOfAttemptedScore = useSelector(selectSuccessOfAttemptedScore);
  const attemptedScore = useSelector(selectAttemptedScore);
  const correctCount = useSelector(selectCorrectCount);
  const incorrectCount = useSelector(selectIncorrectCount);
  const skippedCount = useSelector(selectSkippedCount);
  const notScoredCount = useSelector(selectNotScoredCount);

  const dataSet = useMemo(() => {
    const computedStyles = getComputedStyle(document.querySelector(':root')!);
    return {
      labels: ['Correct', 'Incorrect', 'Skipped', 'Not Scored'],
      datasets: [
        {
          data: [correctCount, incorrectCount, skippedCount, notScoredCount],
          backgroundColor: [
            `hsl(${computedStyles.getPropertyValue('--su')})`,
            `hsl(${computedStyles.getPropertyValue('--er')})`,
            `hsl(${computedStyles.getPropertyValue('--in')})`,
            `hsl(${computedStyles.getPropertyValue('--nc')})`,
          ],
          hoverOffset: 4,
        },
      ],
    };
  }, [correctCount, incorrectCount, skippedCount, notScoredCount]);

  return (
    <div className="h-auto md:h-3/4 lg:h-screen flex flex-col justify-start">
      <div className="card bg-base-100">
        <div className="stats justify-between w-full p-4">
          <BigNumber
            title="Correct"
            value={correctCount}
            className="text-success"
          />
          <BigNumber
            title="Incorrect"
            value={incorrectCount}
            className="text-error"
          />
          <BigNumber
            title="Skipped"
            value={skippedCount}
            className="text-info"
          />
          <BigNumber
            title="Not Scored"
            value={notScoredCount}
            className="text-neutral-content"
          />
        </div>
        <DonutChart data={dataSet} />
      </div>
      <div className="flex justify-between pt-4">
        <div>
          <PercentageMetric {...successOfAttemptedScore} title="Accuracy" />
        </div>
        <div>
          <PercentageMetric {...attemptedScore} title="Completion" />
        </div>
      </div>
    </div>
  );
};
