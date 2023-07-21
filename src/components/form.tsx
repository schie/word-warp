import { FormState, Sound, SoundRepresentation, SoundType } from '_types';
import { FC, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { ErrorMessage } from './_error-message';

export interface FormProps extends FormState {
  onSubmit: (formState: FormState) => void;
  onSoundsChange: (sounds: Sound[]) => void;
  onPatternChange: (pattern: Array<'C' | 'V'>) => void;
  onQuantityChange: (quantity: number) => void;
  allConsonants: SoundRepresentation[];
  allDiphthongs: SoundRepresentation[];
  allVowels: SoundRepresentation[];
  className?: string;
}

const formValidationSchema = Yup.object().shape({
  quantity: Yup.number().required().min(1).max(20),
  pattern: Yup.string()
    .required()
    .matches(/^[CV]+$/),
  sounds: Yup.array()
    .of(
      Yup.object().shape({
        sound: Yup.string().required(),
        letters: Yup.array().of(Yup.string().required()).required(),
        type: Yup.string()
          .oneOf(['consonant', 'vowel', 'diphthong'])
          .required(),
      })
    )
    .min(1),
});

const useYupValidationResolver = (formValidationSchema: Yup.AnySchema) =>
  useCallback(
    async (data: any) => {
      try {
        const values = await formValidationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: (errors as any).inner.reduce(
            (allErrors: any, currentError: any) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [formValidationSchema]
  );

interface FormmState extends Omit<FormState, 'pattern'> {
  pattern: string;
}

export const Form: FC<FormProps> = ({
  sounds,
  pattern,
  quantity,
  onSubmit,
  className,
  onSoundsChange,
  onPatternChange,
  onQuantityChange,
  allConsonants,
  allDiphthongs,
  allVowels,
}) => {
  const patternStr = useMemo(() => pattern.join(''), [pattern]);
  const { handleSubmit, setValue, reset, register, formState, getValues } =
    useForm<FormmState>({
      defaultValues: { sounds, pattern: patternStr, quantity },
      resolver: useYupValidationResolver(formValidationSchema),
    });

  const onSubmitCallback = useCallback(
    (form: FormmState) =>
      onSubmit({
        ...form,
        pattern: form.pattern.split('') as Array<'C' | 'V'>,
      }),
    [onSubmit]
  );

  const [selectedSounds, setSelectedSounds] =
    useState<SoundRepresentation[]>(sounds);

  const clearForm = useCallback(() => {
    reset({});
    setSelectedSounds([]);
  }, [reset]);
  // const { } = useMemo(() => register('sounds'), [register]);

  const handleSoundSelection = useCallback(
    (type: SoundType, sound: SoundRepresentation) => {
      const sounds = getValues().sounds ?? [];
      // Check if the sound is already selected
      const isAlreadySelected = sounds.some(
        (selectedSound) => selectedSound.sound === sound.sound
      );

      let newSounds;

      if (isAlreadySelected) {
        // If the sound is already selected, remove it from the selected sounds array
        newSounds = sounds.filter(
          (selectedSound) => selectedSound.sound !== sound.sound
        );
      } else {
        // If the sound is not selected, add it to the selected sounds array
        newSounds = [...sounds, { type, ...sound }];
      }

      // Update the form value and call the onSoundsChange prop
      setValue('sounds', newSounds);
      setSelectedSounds(newSounds);
    },
    [setValue, getValues, setSelectedSounds]
  );

  const {
    quantity: quantityError,
    pattern: patternError,
    sounds: soundsError,
  } = formState.errors;

  const classs = useMemo(
    () => `bg-base-100 shadow card h-auto ${className} `,
    [className]
  );

  return (
    <form onSubmit={handleSubmit(onSubmitCallback)} className={classs}>
      <div className="card-body">
        <div className="flex space-x-4 justify-between">
          <div className="w-1/2 form-control">
            <label className="label">
              <span className="label-text">Line Qty</span>
            </label>
            <input
              {...register('quantity')}
              type="number"
              min={1}
              className="input input-bordered w-full input-sm max-w-xs"
            />
            <ErrorMessage error={quantityError} />
          </div>
          <div className="w-1/2 form-control">
            <label className="label">
              <span className="label-text">Pattern</span>
            </label>
            <input
              {...register('pattern')}
              type="text"
              min={1}
              className="input input-bordered w-full input-sm max-w-xs"
              placeholder="Enter pattern (e.g., 'CVC')"
            />
            <ErrorMessage error={patternError} />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-lg font-semibold text-neutral-content">
            Consonants
          </label>
          <SoundGrid
            type={SoundType.Consonant}
            sounds={allConsonants}
            selectedSounds={selectedSounds}
            onSelect={handleSoundSelection}
          />
        </div>
        <div>
          <label className="block mb-2 text-lg font-semibold text-neutral-content">
            Vowels
          </label>
          <SoundGrid
            type={SoundType.Vowel}
            sounds={allVowels}
            selectedSounds={selectedSounds}
            onSelect={handleSoundSelection}
          />
        </div>
        <div>
          <label className="block mb-2 text-lg font-semibold text-neutral-content">
            Diphthongs
          </label>
          <SoundGrid
            type={SoundType.Diphthong}
            sounds={allDiphthongs}
            selectedSounds={selectedSounds}
            onSelect={handleSoundSelection}
          />
        </div>
        <ErrorMessage error={soundsError as any} />
        {/* buttons side-by-side, one to generate the words and one to clear the
        form; 'generate' is 75% width and 'clear' is 25% width on desktop, and
        100% width on mobile */}
        <div className="divider" />
        <div className="card-actions justify-between">
          <button
            disabled={formState.isSubmitting || !formState.isValid}
            type="submit"
            // className="w-3/4 mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            className="btn btn-primary btn-wide"
          >
            Generate
          </button>
          <button
            disabled={formState.isSubmitting}
            onClick={clearForm}
            // className="w-1/4 mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            className="btn btn-warning"
            type="reset"
          >
            Clear
          </button>
        </div>
        <div className="flex space-x-4 justify-between"></div>
      </div>
    </form>
  );
};

interface SoundButtonProps {
  sound: SoundRepresentation;
  selected: boolean;
  onSelect: () => void;
}

const SoundButton: FC<SoundButtonProps> = ({ sound, selected, onSelect }) => {
  const className = useMemo(
    () => `btn btn-sm ${selected ? 'btn-secondary' : 'btn-ghost'}`,
    [selected]
  );
  return (
    <button onClick={onSelect} className={className} type="button">
      {sound.sound}
    </button>
  );
};

interface SoundGridProps {
  type: SoundType;
  sounds: SoundRepresentation[];
  selectedSounds: SoundRepresentation[];
  onSelect: (type: SoundType, sound: SoundRepresentation) => void;
}

const SoundGrid: FC<SoundGridProps> = ({
  type,
  sounds,
  selectedSounds = [],
  onSelect,
}) => {
  const selectedSoundsSet = useMemo(
    () => new Set(selectedSounds.map((s) => s.sound)),
    [selectedSounds]
  );

  const soundsX = useMemo(
    () =>
      sounds.map((sound) => ({
        sound,
        selected: selectedSoundsSet.has(sound.sound),
        onSelect: () => onSelect(type, sound),
      })),
    [sounds, selectedSoundsSet, type, onSelect]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {soundsX.map(({ sound, selected, onSelect }, index) => (
        <SoundButton
          key={index}
          sound={sound}
          selected={selected}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
