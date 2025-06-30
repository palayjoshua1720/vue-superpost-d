/* eslint-disable */
<template>
    <div class="space-y-4 sm:space-y-6">
        <!-- User Profile Section -->
        <div class="card">
            <div class="card-header">
                <h2 class="text-base sm:text-lg font-medium text-primary-text dark:text-primary-dark-text">My Profile</h2>
            </div>
            <div class="card-body">
                <div class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                    <!-- <div class="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-primary dark:bg-primary-dark flex items-center justify-center text-white text-2xl sm:text-3xl font-semibold shadow-lg transform transition-transform duration-300 hover:scale-105">
                        {{ userInitials }}
                    </div> -->
                    <div class="relative group">
                    <button
                        class="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-primary dark:bg-primary-dark flex items-center justify-center text-white text-2xl sm:text-3xl font-semibold shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none"
                        @click="triggerProfileImageInput"
                        type="button"
                    >
                        <img
                            v-if="profileImage"
                            :src="profileImage"
                            alt="Profile"
                            class="h-full w-full object-cover rounded-full"
                        />
                        <span v-else>
                            {{ userInitials }}
                        </span>
                        <!-- Pencil Icon -->
                        <span
                            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"
                        >
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V17h4"></path>
                            </svg>
                        </span>
                    </button>
                    <input
                        ref="profileImageInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="onProfileImageChange"
                    />
                </div>
                    <div class="text-center sm:text-left">
                        <h3 class="text-lg sm:text-xl font-semibold text-primary-text dark:text-primary-dark-text">
                            {{ currentUser?.name }}
                        </h3>
                        <p class="text-sm sm:text-base text-secondary-text dark:text-secondary-dark-text">
                            {{ currentUser?.email }}
                        </p>
                        <div class="mt-2">
                            <span class="badge badge-success">
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Update Information Section -->
        <div class="card">
            <div class="card-header">
                <h2 class="text-base sm:text-lg font-medium text-primary-text dark:text-primary-dark-text">Update Information</h2>
            </div>
            <div class="card-body">
                <div class="mb-4 flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        class="px-4 py-2 focus:outline-none"
                        :class="activeTab === 'profile' ? 'border-b-2 border-primary font-semibold text-primary' : 'text-secondary-text'"
                        @click="activeTab = 'profile'"
                    >
                        Profile Details
                    </button>
                    <button
                        class="px-4 py-2 focus:outline-none"
                        :class="activeTab === 'password' ? 'border-b-2 border-primary font-semibold text-primary' : 'text-secondary-text'"
                        @click="activeTab = 'password'"
                    >
                        Change Password
                    </button>
                </div>
                <div v-if="activeTab === 'profile'">
                    <form @submit.prevent="updateProfile" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Name</label>
                            <input v-model="editUser.name" type="text" class="input input-bordered w-full" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Email</label>
                            <input v-model="editUser.email" type="email" class="input input-bordered w-full" />
                        </div>
                        <button type="submit" class="btn btn-primary">Update</button>
                        <span v-if="updateMsg" class="ml-2 text-green-600">{{ updateMsg }}</span>
                    </form>
                </div>
                <div v-else>
                    <form @submit.prevent="changePassword" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Current Password</label>
                            <input v-model="passwordForm.current" type="password" class="input input-bordered w-full" required />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">New Password</label>
                            <input v-model="passwordForm.new" type="password" class="input input-bordered w-full" required />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Confirm New Password</label>
                            <input v-model="passwordForm.confirm" type="password" class="input input-bordered w-full" required />
                        </div>
                        <button type="submit" class="btn btn-primary">Change Password</button>
                        <span v-if="passwordMsg" class="ml-2 text-green-600">{{ passwordMsg }}</span>
                        <span v-if="passwordError" class="ml-2 text-red-600">{{ passwordError }}</span>
                    </form>
                </div>
            </div>
        </div>

        <!-- Hobbies Section -->
        <div class="card">
            <div class="card-header flex justify-between items-center">
                <h2 class="text-base sm:text-lg font-medium text-primary-text dark:text-primary-dark-text">Hobbies</h2>
                <button class="btn btn-sm btn-success" @click="showHobbyModal = true">Add Hobby</button>
            </div>
            <div class="card-body">
                <div v-if="hobbies.length === 0" class="text-secondary-text text-center">No hobbies added yet.</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div
                        v-for="(hobby, idx) in hobbies"
                        :key="idx"
                        class="card shadow-md hover:shadow-lg transition-shadow duration-200 relative group cursor-pointer"
                    >
                        <img v-if="hobby.imageUrl" :src="hobby.imageUrl" alt="Hobby Image" class="w-full h-32 object-cover rounded-t" />
                        <div class="p-4">
                            <h3 class="font-semibold text-lg">{{ hobby.name }}</h3>
                            <p class="text-sm text-secondary-text break-words">{{ hobby.description }}</p>
                        </div>
                        <!-- Edit Icon Overlay -->
                        <span
                            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"
                            @click.stop="editHobby(idx)"
                        >
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm0 0V17h4"></path>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Hobby Modal -->
        <div v-if="showHobbyModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg relative">
                <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600" @click="closeHobbyModal">&times;</button>
                <h3 class="text-lg font-semibold mb-4">{{ editingHobbyIdx !== null ? 'Edit Hobby' : 'Add Hobby' }}</h3>
                <form @submit.prevent="editingHobbyIdx !== null ? updateHobby() : addHobby()" class="space-y-3">
                    <div>
                        <label class="block text-sm font-medium mb-1">Hobby Name</label>
                        <input v-model="newHobby.name" type="text" class="input input-bordered w-full" required />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Description</label>
                        <textarea v-model="newHobby.description" class="input input-bordered w-full" required></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Image</label>
                        <input type="file" accept="image/*" @change="onHobbyImageChange" class="input input-bordered w-full" />
                        
                        <img v-if="newHobby.imageUrl" :src="newHobby.imageUrl" alt="Preview" class="mt-2 w-24 h-24 object-cover rounded" />
                    </div>
                    <div class="flex gap-2">
                        <button v-if="editingHobbyIdx !== null" type="button" class="btn btn-danger flex-1" @click="deleteHobby">Delete</button>
                        <button type="submit" class="btn btn-primary flex-1">{{ editingHobbyIdx !== null ? 'Update' : 'Add Hobby' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, reactive } from 'vue'
import { useTitle } from '@/composables/ui/useTitle'
import { useUser } from '@/composables/auth/useUser'
import { sampleApi } from '@/services/api'

const appTitle = computed(() => process.env.VUE_APP_TITLE || 'Superpost')
useTitle(`${appTitle.value} - About`)

const { userInitials, currentUser } = useUser()

const activeTab = ref<'profile' | 'password'>('profile')

const passwordForm = reactive({
    current: '',
    new: '',
    confirm: ''
})
const passwordMsg = ref('')
const passwordError = ref('')

function changePassword() {
    passwordMsg.value = ''
    passwordError.value = ''
    // Simulate password change logic
    if (passwordForm.new !== passwordForm.confirm) {
        passwordError.value = 'New passwords do not match.'
        return
    }
    if (!passwordForm.current || !passwordForm.new) {
        passwordError.value = 'Please fill in all fields.'
        return
    }
    // Simulate success
    passwordMsg.value = 'Password changed!'
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
    setTimeout(() => passwordMsg.value = '', 2000)
    setTimeout(() => passwordError.value = '', 2000)
}

// Update Information Section
const editUser = reactive({
    name: currentUser.value?.name || '',
    email: currentUser.value?.email || ''
})
const updateMsg = ref('')
function updateProfile() {
    // Simulate update (replace with API call as needed)
    currentUser.value.name = editUser.name
    currentUser.value.email = editUser.email
    updateMsg.value = 'Profile updated!'
    setTimeout(() => updateMsg.value = '', 2000)
}

// Hobbies Section
const hobbies = ref<Array<{ name: string, description: string, imageUrl?: string }>>([])
const showHobbyModal = ref(false)
const newHobby = reactive({
    name: '',
    description: '',
    imageUrl: ''
})
const editingHobbyIdx = ref<number|null>(null)

function onHobbyImageChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
            newHobby.imageUrl = ev.target?.result as string
        }
        reader.readAsDataURL(file)
    }
}

function addHobby() {
    hobbies.value.push({
        name: newHobby.name,
        description: newHobby.description,
        imageUrl: newHobby.imageUrl
    })
    resetHobbyForm()
    showHobbyModal.value = false
}

function editHobby(idx: number) {
    editingHobbyIdx.value = idx
    const hobby = hobbies.value[idx]
    newHobby.name = hobby.name
    newHobby.description = hobby.description
    newHobby.imageUrl = hobby.imageUrl || ''
    showHobbyModal.value = true
}

function updateHobby() {
    if (editingHobbyIdx.value !== null) {
        hobbies.value[editingHobbyIdx.value] = {
            name: newHobby.name,
            description: newHobby.description,
            imageUrl: newHobby.imageUrl
        }
        resetHobbyForm()
        showHobbyModal.value = false
    }
}

function deleteHobby() {
    if (editingHobbyIdx.value !== null) {
        hobbies.value.splice(editingHobbyIdx.value, 1)
        resetHobbyForm()
        showHobbyModal.value = false
    }
}

function closeHobbyModal() {
    resetHobbyForm()
    showHobbyModal.value = false
}

function resetHobbyForm() {
    newHobby.name = ''
    newHobby.description = ''
    newHobby.imageUrl = ''
    editingHobbyIdx.value = null
}

// update profile pic/initals
const profileImage = ref<string | null>(null)
const profileImageInput = ref<HTMLInputElement | null>(null)

function triggerProfileImageInput() {
    profileImageInput.value?.click()
}

function onProfileImageChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
            profileImage.value = ev.target?.result as string
        }
        reader.readAsDataURL(file)
    }
}

// API Response State (existing)
const apiMessage = ref('')
const loading = ref(true)
const error = ref('')

// Fetch API Response - this is a test to see if the API is working
const fetchApiMessage = async () => {
    try {
        loading.value = true
        error.value = ''
        const response = await sampleApi.getMessage()
        apiMessage.value = response.message
    } catch (err) {
        error.value = 'Failed to fetch message from Laravel API'
        console.error('API Error:', err)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchApiMessage()
})
</script>