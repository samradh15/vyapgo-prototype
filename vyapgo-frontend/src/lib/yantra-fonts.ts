import { Noto_Sans_Devanagari, Noto_Sans } from 'next/font/google'

export const devanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700', '900'],
  display: 'swap',
  variable: '--font-devanagari'
})

export const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans'
})
