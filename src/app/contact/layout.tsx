import Footer from '@/components/public/Footer'

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
