import SecureLS from 'secure-ls';

let ls;

if (typeof window !== 'undefined') {
  ls = new SecureLS({ encodingType: 'aes' });
}

export const getItemLocalStorage = key => {
  if (typeof window !== 'undefined') {
    return ls.get(key);
  }
};

export const setItemLocalStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    return ls.set(key, value);
  }
};

export const removeItemLocalStorage = key => {
  if (typeof window !== 'undefined') {
    return ls.remove(key);
  }
};
