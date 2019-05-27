export const formatDate = (date?: Date): string =>
  date === undefined || date === null
    ? 'present'
    : `${
        [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ][new Date(date).getMonth()]
      } ${new Date(date).getDay()}, ${new Date(date).getFullYear()}`;
