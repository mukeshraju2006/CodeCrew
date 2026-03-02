import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function ProductPreview() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const cardRef = useRef(null)
  const innerItemsRef = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const text = textRef.current
    const card = cardRef.current
    const innerItems = innerItemsRef.current

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 30%",
        scrub: 1
      }
    })

    // Split reveal: text from left, card from right
    tl.fromTo(
      text,
      { x: -150, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    )
    .fromTo(
      card,
      { x: 150, opacity: 0, rotateY: 15, scale: 0.9 },
      { x: 0, opacity: 1, rotateY: 0, scale: 1, duration: 1.2, ease: "power3.out" },
      "-=1"
    )
    .fromTo(
      innerItems,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out"
      },
      "-=0.5"
    )

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 bg-black text-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">

        {/* LEFT TEXT */}
        <div ref={textRef} className="opacity-0">
          <h2 className="text-5xl font-bold leading-tight">
            See Collaboration <br /> In Action
          </h2>

          <p className="mt-6 text-gray-400 text-lg">
            Structured requests. Clear skill alignment.
            No random DMs. Just focused building.
          </p>
        </div>

        {/* RIGHT CARD */}
        <div
          ref={cardRef}
          className="opacity-0 bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl transform-gpu"
          style={{ perspective: 1000 }}
        >
          <div
            ref={el => (innerItemsRef.current[0] = el)}
            className="text-xl font-semibold"
          >
            AI Hackathon Platform
          </div>

          <div
            ref={el => (innerItemsRef.current[1] = el)}
            className="text-gray-400 text-sm mt-3"
          >
            Looking for 2 backend developers (Node + MongoDB)
          </div>

          <div
            ref={el => (innerItemsRef.current[2] = el)}
            className="mt-6 bg-gray-800 p-4 rounded-lg text-sm text-gray-300"
          >
            Contribution Proposal:
            <br />
            I can design REST APIs and structure the database schema.
          </div>
        </div>

      </div>
    </section>
  )
}