import { useEffect, type ReactNode } from 'react'

export type Brand = 'wireframe' | 'klub' | 'atlas' | 'showup'

export const BRANDS = ['wireframe', 'klub', 'atlas', 'showup'] as const

export interface BrandProviderProps {
  brand: Brand
  children: ReactNode
}

export function BrandProvider({ brand, children }: BrandProviderProps) {
  useEffect(() => {
    document.documentElement.dataset.brand = brand
  }, [brand])
  return <>{children}</>
}
