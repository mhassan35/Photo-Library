import { createApi } from 'unsplash-js';
const apiUrl = import.meta.env.VITE_PHOTO_LIBRARY;
const unsplash = createApi({
  accessKey: apiUrl,
});
export default unsplash;
