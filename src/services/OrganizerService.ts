import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getOrganizers(perPage: number, page: number) {
    return apiClient.get('/organizations?_limit=' + perPage + '&_page=' + page)  // Changed from /organizers
  },
  getOrganizer(id: number) {
    return apiClient.get('/organizations/' + id)  // Changed from /organizers
  },
  // Add POST method for creating organizations
  createOrganizer(organization: any) {
    return apiClient.post('/organizations', organization)
  }
}