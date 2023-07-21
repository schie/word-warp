export enum SoundType {
  Consonant = 'consonant',
  Vowel = 'vowel',
  Diphthong = 'diphthong',
}

export interface Sound extends SoundRepresentation {
  type: SoundType;
}

export interface FormState {
  sounds: Sound[];
  pattern: Array<'C' | 'V'>;
  quantity: number;
}

export interface GeneratedWord {
  alphabet: string[];
  phonetic: string[];
}

export enum WordScore {
  Correct = 'correct',
  Incorrect = 'incorrect',
  Skipped = 'skipped',
  NotScored = 'not-scored',
}

export interface Word {
  sounds: Sound[];
}

export enum CueScore {
  Independent = 'Independent',
  Minimal = 'Minimal',
  Moderate = 'Moderate',
  Maximum = 'Maximum',
  NotScored = 'NotScored',
}

export interface WordListItem extends Word {
  spellingIndexes: number[];
  score: WordScore;
  notes: string;
  cueScore: CueScore;
}

export interface WordListState {
  notes: string;
  words: WordListItem[];
}

export interface SoundRepresentation {
  sound: string;
  letters: string[];
}

export interface SoundRepoState {
  consonants: {
    plosive: SoundRepresentation[];
    nasal: SoundRepresentation[];
    fricative: SoundRepresentation[];
    tapFlap: SoundRepresentation[];
  };
  vowels: {
    front: SoundRepresentation[];
    central: SoundRepresentation[];
    back: SoundRepresentation[];
  };
  diphthongs: SoundRepresentation[];
  restrictions: { [key: string]: string[] };
}

export interface Score {
  percentage: number;
  fraction: string;
}
