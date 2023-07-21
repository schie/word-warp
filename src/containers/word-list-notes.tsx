import { ChangeEventHandler, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { wordListActions } from 'store/_word-list-slice';

function selectWordListNotes(state: RootState): string {
  return state.wordList.notes;
}

export const WordListNotes = () => {
  const notes = useSelector(selectWordListNotes);
  const dispatch = useDispatch();
  const onChangeCallback: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    ({ target }) => dispatch(wordListActions.setNotes(target.value)),
    [dispatch]
  );
  return (
    <div className="card bg-base-100">
      <textarea
        className="textarea h-full w-full"
        value={notes}
        onChange={onChangeCallback}
      />
    </div>
  );
};
