export interface CurrentlyReading {
  title: string;
  author: string;
  synopsis: string;
  coverImage: string;
  coverAlt: string;
}

export const currentlyReading: CurrentlyReading = {
  title: 'Leadership is Language',
  author: 'L. David Marquet',
  synopsis:
    'The words leaders use shape how teams think and act. Marquet shows how small shifts in language — inviting dissent, giving intent, deciding together — turn passive followers into engaged owners.',
  coverImage: '/reading/leadership-is-language.jpg',
  coverAlt: 'Cover of Leadership is Language by L. David Marquet',
};
