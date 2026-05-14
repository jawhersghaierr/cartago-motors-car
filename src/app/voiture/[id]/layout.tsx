import Footer from '@/components/public/Footer'

export default function VoitureLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
