import { Sound } from '_types';
import { Form, FormProps } from 'components';
import { useWordGenerator } from 'hooks';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllConsonants,
  selectAllVowels,
  selectAllDiphthongs,
  selectFormData,
} from 'store';
import { formDataActions } from 'store/_form-data-slice';
import { wordListActions } from 'store/_word-list-slice';

export const CurrentForm: FC<Pick<FormProps, 'className'>> = ({ ...props }) => {
  const { pattern, quantity, sounds } = useSelector(selectFormData);
  const allConsonants = useSelector(selectAllConsonants);
  const allDiphthongs = useSelector(selectAllDiphthongs);
  const allVowels = useSelector(selectAllVowels);
  const [generateWords, { words }] = useWordGenerator();

  const dispatch = useDispatch();

  useEffect(() => {
    if (words.length) {
      dispatch(
        wordListActions.initializeWords(words?.map((sounds) => ({ sounds })))
      );
    }
  }, [words, dispatch]);

  const onSoundsChange = useCallback(
    (parms: Sound[]) => dispatch(formDataActions.setSounds(parms)),
    [dispatch]
  );

  const onPatternChange = useCallback(
    (...parm: Parameters<typeof formDataActions.setPattern>) =>
      dispatch(formDataActions.setPattern(...parm)),
    [dispatch]
  );

  const onQuantityChange = useCallback(
    (parm: number) => dispatch(formDataActions.setQuantity(parm)),
    [dispatch]
  );

  const onSubmit = useCallback(
    (...parms: Parameters<typeof formDataActions.initialize>) => {
      dispatch(formDataActions.initialize(...parms));
      return generateWords();
    },
    [dispatch, generateWords]
  );

  return (
    <Form
      {...props}
      sounds={sounds}
      allConsonants={allConsonants}
      allDiphthongs={allDiphthongs}
      allVowels={allVowels}
      pattern={pattern}
      quantity={quantity}
      onSoundsChange={onSoundsChange}
      onPatternChange={onPatternChange}
      onQuantityChange={onQuantityChange}
      onSubmit={onSubmit}
    />
  );
};
