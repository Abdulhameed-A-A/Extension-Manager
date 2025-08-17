export interface ExtensionRaw {
  logo: string,
  name: string,
  description: string,
  isActive: boolean
}

export interface Extension extends ExtensionRaw {
  id: string
}