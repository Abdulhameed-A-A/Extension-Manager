export interface Extension {
  id: string,
  logo: string,
  name: string,
  description: string,
  isActive: boolean
}

export type FilterType = "all" | "active" | "inactive"