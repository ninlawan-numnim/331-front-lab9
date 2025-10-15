import axios, { AxiosResponse } from 'axios'
import type { Organizer } from '@/types'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getOrganizers(): Promise<AxiosResponse<Organizer[]>> {
    return apiClient.get<Organizer[]>('/organizers')
  },
  
  getOrganizer(id: number): Promise<AxiosResponse<Organizer>> {
    return apiClient.get<Organizer>(`/organizers/${id}`)
  },
  
  createOrganizer(organizer: Organizer): Promise<AxiosResponse<Organizer>> {
    return apiClient.post<Organizer>('/organizers', organizer)
  }
}