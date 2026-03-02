import SpaceScene from "./SpaceScene"

export default function Hero() {
  return (
    <section className="relative h-screen bg-black overflow-hidden">

      <SpaceScene />

      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      <div className="relative z-10 h-full flex items-center justify-center text-center px-6 pointer-events-none">
        <div>
          <h1 className="text-6xl md:text-7xl font-bold leading-tight text-white">
            Build Projects With <br /> The Right Developers
          </h1>

          <p className="mt-6 text-gray-300 max-w-2xl mx-auto text-lg">
            A structured collaboration platform for developer communities.
          </p>

          <div className="mt-10 flex justify-center gap-6 pointer-events-auto">
            <a
              href="/register"
              className="px-8 py-3 bg-white text-black rounded-lg hover:scale-105 transition-transform"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="px-8 py-3 border border-gray-600 rounded-lg hover:bg-white hover:text-black transition-all"
            >
              Login
            </a>
          </div>
        </div>
      </div>

    </section>
  )
}