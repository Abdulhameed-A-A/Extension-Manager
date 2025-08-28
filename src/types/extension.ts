export interface ExtensionRaw {
  logo: string,
  name: string,
  description: string,
  isActive: boolean
}

export interface Extension extends ExtensionRaw {
  id: string
}

export type FilterType = "all" | "active" | "inactive"