import { createApi } from 'unsplash-js';
const apiUrl = import.meta.env.VITE_PHOTO_LIBRARY;
const unsplash = createApi({
  accessKey: apiUrl,
});
console.log('Unsplash key:', apiUrl);
export default unsplash;
