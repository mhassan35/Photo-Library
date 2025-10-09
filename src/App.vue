<template>
  <v-app>
    <v-main>
      <v-container>
        <h1 class="mb-6 text-center">Unsplash Search Gallery</h1>

        <!-- Search Bar -->
        <v-text-field
          v-model="query"
          label="Search for photos..."
          variant="outlined"
          clearable
          @keyup.enter="searchPhotos"
          class="mb-6"
        ></v-text-field>

        <v-btn
          color="primary"
          @click="searchPhotos"
          :disabled="loading"
          class="mb-6"
        >
          Search
        </v-btn>

        <!-- Masonry Grid -->
        <div class="masonry-grid" v-if="photos.length && !loading">
          <div v-for="photo in photos" :key="photo.id" class="masonry-item">
            <v-card class="photo-card">
              <v-img
                :src="photo.urls.regular"
                :alt="photo.alt_description || 'Unsplash Photo'"
                class="photo-img"
                cover
              ></v-img>

              <div class="overlay">
                <div class="overlay-text">
                  <p>{{ photo.user.name }}</p>
                  <v-btn
                    size="small"
                    color="white"
                    variant="text"
                    :href="photo.links.html"
                    target="_blank"
                  >
                    View
                  </v-btn>
                </div>
              </div>
            </v-card>
          </div>
        </div>

        <!-- No Results -->
        <v-alert
          v-if="!loading && photos.length === 0 && hasSearched"
          type="warning"
          class="mt-10 text-center"
        >
          No photos found for "{{ query }}"
        </v-alert>

        <!-- Loading Overlay -->
        <v-overlay v-model="loading" class="align-center justify-center" persistent>
          <v-progress-circular
            size="64"
            width="6"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-overlay>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import unsplash from './components/services/unsplash.js'

const photos = ref([])
const query = ref('')
const loading = ref(false)
const hasSearched = ref(false)

// Load default photos initially
onMounted(async () => {
  await getDefaultPhotos()
})

const getDefaultPhotos = async () => {
  loading.value = true
  try {
    const result = await unsplash.photos.list({ page: 1, perPage: 10 })
    photos.value = result.response.results
  } catch (error) {
    console.error('Default Load Error:', error)
  } finally {
    loading.value = false
  }
}

const searchPhotos = async () => {
  if (!query.value.trim()) {
    await getDefaultPhotos()
    return
  }

  loading.value = true
  hasSearched.value = true

  try {
    const result = await unsplash.search.getPhotos({
      query: query.value,
      page: 1,
      perPage: 15,
    })
    photos.value = result.response.results
    console.log('Search Results:', photos.value)
  } catch (error) {
    console.error('Search Error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.masonry-grid {
  column-count: 4;
  column-gap: 16px;

  @media (max-width: 1200px) {
    column-count: 3;
  }

  @media (max-width: 900px) {
    column-count: 2;
  }

  @media (max-width: 600px) {
    column-count: 1;
  }
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 16px;
}

/* Remove hover scale */
.photo-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.photo-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  border-radius: 12px;
}

/* Hover overlay */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-card:hover .overlay {
  opacity: 1;
}

.overlay-text {
  color: white;
  text-align: center;
  font-size: 14px;
}
</style>
