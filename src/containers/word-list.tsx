import React, { useCallback, useRef } from 'react';
import { CueScore, WordListState, WordScore } from '_types';
import { WordList } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { wordListActions } from 'store/_word-list-slice';

function selectWordList(state: RootState): WordListState {
  return state.wordList;
}
export const CurrentWordList = () => {
  const props = useSelector(selectWordList);

  const dispatch = useDispatch();
  const onScoreChange = useCallback(
    (index: number, score: WordScore) => {
      dispatch(wordListActions.setWordScore({ index, score }));
    },
    [dispatch]
  );

  const onCueScoreChange = useCallback(
    (index: number, cueScore: CueScore) =>
      dispatch(wordListActions.setWordCueScore({ index, cueScore })),
    [dispatch]
  );

  const onNoteChangeCallback = useCallback(
    (index: number, notes: string) => {
      dispatch(wordListActions.setWordNotes({ index, notes }));
    },
    [dispatch]
  );

  const onWordSpeakPress = useCallback((word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(utterance);
  }, []);

  const childWindow = useRef<Window | null>(null);

  const onPresentPress = useCallback((word: string) => {
    if (!childWindow.current || childWindow.current?.closed) {
      const htmlString = `
      <html>
        <head><title>Display Window</title></head>
        <body style="display: flex; justify-content: center; align-items: center; height: 100vh;">
          <div id="content" style="font-size: 150px;"></div>
        </body>
      </html>`;

      childWindow.current = window.open(
        '',
        'Word Warp',
        'width=800,height=600'
      );
      //@ts-ignore
      childWindow.current.document.write(htmlString);
    }

    if (childWindow.current && !childWindow.current.closed) {
      //@ts-ignore
      childWindow.current.document.getElementById('content').textContent = word;
    }
  }, []);

  return (
    <WordList
      {...props}
      onScoreChange={onScoreChange}
      onCueScoreChange={onCueScoreChange}
      onNoteChange={onNoteChangeCallback}
      onWordUtterancePress={onWordSpeakPress}
      onPresentPress={onPresentPress}
    />
  );
};
