export interface LaunchLinks {
  patch: {
    small: string | null
  }
  article: string | null
  webcast: string | null
}

export interface Launch {
  id: string
  name: string
  date_utc: string
  details: string | null
  success: boolean | null | undefined
  links: LaunchLinks
}
