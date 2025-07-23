let clipboardData: string | null = null;

export const setClipboard = (val: string) => {
  clipboardData = val;
};

export const getClipboard = () => clipboardData;
