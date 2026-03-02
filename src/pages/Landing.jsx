import { useEffect, useState } from "react"
import Hero from "../components/landing/Hero"
import Features from "../components/landing/Features"
import Workflow from "../components/landing/Workflow"
import ProductPreview from "../components/landing/ProductPreview"
import CTA from "../components/landing/CTA"

export default function Landing() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="bg-black text-white overflow-x-hidden">
      <Hero scrollY={scrollY} />
      <Features />
      <Workflow />
      <ProductPreview />
      <CTA />
    </div>
  )
}