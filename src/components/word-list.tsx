import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';

import {
  CueScore,
  WordListItem as WLI,
  WordListState,
  WordScore,
} from '_types';

interface WordListItemScoreButtonProps {
  score: WordScore;
  value: WordScore;
  onClick: (score: WordScore) => void;
  className?: string;
}
const WordListItemScoreButton: FC<WordListItemScoreButtonProps> = ({
  score,
  value,
  onClick,
  className,
}) => {
  const matches = useMemo(() => score === value, [score, value]);

  const buttonClass = useMemo(() => {
    const styles = ['btn btn-sm', className];
    if (matches) {
      switch (score) {
        case WordScore.Correct:
          styles.push('btn-success');
          break;
        case WordScore.Incorrect:
          styles.push('btn-error');
          break;
        case WordScore.Skipped:
        default:
          styles.push('btn-info');
      }
    } else {
      styles.push('btn-neutral');
    }

    return styles.join(' ');
  }, [matches, score, className]);

  const iconClass = useMemo(() => {
    switch (score) {
      case WordScore.Correct:
        return 'fas fa-check';
      case WordScore.Incorrect:
        return 'fas fa-times';
      case WordScore.Skipped:
      default:
        return 'fas fa-step-forward';
    }
  }, [score]);

  const onPressCallback = useCallback(() => onClick(score), [onClick, score]);

  return (
    <button key={score} className={buttonClass} onClick={onPressCallback}>
      <i className={iconClass} />
    </button>
  );
};

interface WordListItemProps extends WLI {
  index: number;
  onScoreChange: (index: number, score: WordScore) => void;
  onNoteChange: (index: number, note: string) => void;
  onWordUtterancePress: (word: string) => void;
  onCueScoreChange: (index: number, cueScore: CueScore) => void;
  onPresentPress: (word: string) => void;
}
const WordListItem: FC<WordListItemProps> = ({
  score,
  notes,
  sounds,
  spellingIndexes,
  index,
  cueScore,
  onScoreChange,
  onNoteChange,
  onCueScoreChange,
  onWordUtterancePress,
  onPresentPress,
}) => {
  const spelling = useMemo(
    () => spellingIndexes.map((i, idx) => sounds[idx]?.letters?.[i]).join(''),
    [spellingIndexes, sounds]
  );

  const soundString = useMemo(() => {
    return sounds
      .filter((x) => x)
      .map((s) => s.sound.replaceAll('/', ''))
      .join('');
  }, [sounds]);

  const onScoreButtonClick = useCallback(
    (score: WordScore) => onScoreChange(index, score),
    [index, onScoreChange]
  );

  const [knowtes, setNotes] = useState(notes);

  const onNoteChangeCallback = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onNoteChange(index, event.target.value),
    [onNoteChange, index]
  );

  const onUtterancePressCallback = useCallback(() => {
    onWordUtterancePress(spelling);
  }, [onWordUtterancePress, spelling]);

  const onCueScoreChangeCallback = useCallback(
    ({ target }: ChangeEvent<HTMLSelectElement>) =>
      onCueScoreChange(index, target.value as CueScore),
    [onCueScoreChange, index]
  );

  const onPresentCallback = useCallback(
    () => onPresentPress(spelling),
    [spelling]
  );

  return (
    <tr>
      <th>
        <span className="font-bold text-lg">{spelling}</span>
      </th>
      <td>
        <div className="text-sm opacity-50">/{soundString}/</div>
      </td>
      <td>
        <div className="tooltip" data-tip="your mileage may vary">
          <button className="btn btn-ghost" onClick={onUtterancePressCallback}>
            <i className="fas fa-play"></i>
          </button>
        </div>
      </td>
      <td>
        <div className="w-full join flex flex-row">
          {Object.values(WordScore)
            .filter((score) => score !== WordScore.NotScored)
            .map((option, idx) => (
              <WordListItemScoreButton
                className="join-item"
                key={`${score}-${idx}`}
                score={option}
                value={score}
                onClick={onScoreButtonClick}
              />
            ))}
          <select
            value={cueScore}
            className="select select-sm select-bordered join-item"
            onChange={onCueScoreChangeCallback}
          >
            <option disabled>cueing</option>
            <option>{CueScore.Independent}</option>
            <option>{CueScore.Minimal}</option>
            <option>{CueScore.Moderate}</option>
            <option>{CueScore.Maximum}</option>
            <option>{CueScore.NotScored}</option>
          </select>
          <input
            type="text"
            placeholder="Notes"
            className="input input-bordered input-sm w-full max-w-xs join-item"
            value={knowtes}
            onChange={({ target }) => setNotes(target.value)}
            onBlur={onNoteChangeCallback}
            onSubmit={onNoteChangeCallback}
          />
        </div>
      </td>
      <th>
        <button className="btn btn-ghost" onClick={onPresentCallback}>
          <i className="fas fa-tv"></i>
        </button>
      </th>
    </tr>
  );
};

interface WordListProps extends WordListState {
  onScoreChange: (index: number, score: WordScore) => void;
  onNoteChange: (index: number, note: string) => void;
  onWordUtterancePress: (word: string) => void;
  onPresentPress: (word: string) => void;
  onCueScoreChange: (index: number, cueScore: CueScore) => void;
}

export const WordList: FC<WordListProps> = ({
  notes,
  words,
  onScoreChange,
  onCueScoreChange,
  onNoteChange,
  onWordUtterancePress,
  onPresentPress,
}) => {
  return (
    <div className="bg-base-100 shadow p-4 card h-auto overflow-x-auto lg:h-3/4">
      <div className="overflow-x-auto">
        <table className="table table-pin-rows">
          {/* head */}
          <thead>
            <tr>
              <th>Word</th>
              <th>IPA</th>
              <th></th>
              <th>Notes and Score</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {words.map((word, index) => {
              return (
                <WordListItem
                  key={index}
                  {...word}
                  index={index}
                  onScoreChange={onScoreChange}
                  onNoteChange={onNoteChange}
                  onWordUtterancePress={onWordUtterancePress}
                  onCueScoreChange={onCueScoreChange}
                  onPresentPress={onPresentPress}
                />
              );
            })}
          </tbody>
          {/* foot */}
          <tfoot></tfoot>
        </table>
      </div>
    </div>
  );
};
