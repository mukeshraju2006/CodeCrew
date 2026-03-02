import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function Features() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const cards = cardsRef.current

    gsap.fromTo(
      cards,
      {
        y: 80,
        opacity: 0,
        scale: 0.95
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 40%",
          scrub: 1
        }
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 bg-black"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold">
          Everything You Need To Collaborate
        </h2>

        <div className="mt-16 grid md:grid-cols-3 gap-10">
          {["Create Projects", "Send Structured Requests", "Manage Collaborators"].map((title, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:-translate-y-2 transition-transform duration-300"
            >
              <h3 className="text-xl font-semibold">{title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}