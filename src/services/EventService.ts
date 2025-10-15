import axios, { AxiosResponse } from 'axios'
import type { Event } from '@/types'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getEvents(perPage: number, page: number): Promise<AxiosResponse<Event[]>> {
    return apiClient.get<Event[]>(`/events?_limit=${perPage}&_page=${page}`)
  },
  
  getEvent(id: number): Promise<AxiosResponse<Event>> {
    return apiClient.get<Event>(`/events/${id}`)
  },
  
  saveEvent(event: Event): Promise<AxiosResponse<Event>> {
    return apiClient.post<Event>('/events', event)
  },
  
  getEventsByKeyword(
    keyword: string,
    perPage: number,
    page: number
  ): Promise<AxiosResponse<Event[]>> {
    return apiClient.get<Event[]>(
      `/events?q=${keyword}&_limit=${perPage}&_page=${page}`
    )
  },
  
  getOrganizer(id: number): Promise<AxiosResponse<any>> {
    return apiClient.get(`/organizers/${id}`)
  }
}