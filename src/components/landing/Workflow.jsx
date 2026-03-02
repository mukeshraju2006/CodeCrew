import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Workflow() {
  const sectionRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 50%",
          scrub: 1
        }
      }
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 bg-black text-center"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold">
          From Idea To Execution
        </h2>

        <p className="mt-6 text-gray-400 text-lg">
          Post a project. Review requests. Accept contributors.
          Build with clarity.
        </p>
      </div>
    </section>
  )
}