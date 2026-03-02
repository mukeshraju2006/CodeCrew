export default function CTA() {
  return (
    <section className="py-24 px-6 bg-black text-center border-t border-gray-800">
      <h2 className="text-4xl font-bold">
        Ready To Start Building?
      </h2>

      <p className="mt-6 text-gray-400 text-lg">
        Join the collaboration platform built for developers.
      </p>

      <div className="mt-10 flex justify-center gap-6">
        <a
          href="/register"
          className="px-8 py-3 bg-white text-black rounded-lg hover:scale-105 transition-transform"
        >
          Create Account
        </a>
        <a
          href="/login"
          className="px-8 py-3 border border-gray-600 rounded-lg hover:bg-white hover:text-black transition-all"
        >
          Login
        </a>
      </div>
    </section>
  )
}