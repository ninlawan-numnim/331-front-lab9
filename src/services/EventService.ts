import axios, { AxiosResponse } from 'axios'
import type { Event, EventItem } from '@/types'

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
  ): Promise<AxiosResponse<EventItem[]>> {
    // ใช้ title เป็น parameter สำหรับ search
    const url = `/events?title=${keyword}&_limit=${perPage}&_page=${page}`
    console.log('Search URL:', url)
    return apiClient.get<EventItem[]>(url)
  },
  
  getOrganizer(id: number): Promise<AxiosResponse<any>> {
    return apiClient.get(`/organizers/${id}`)
  }
}