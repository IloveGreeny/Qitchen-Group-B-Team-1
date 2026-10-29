export default function Hero() {
  return (
    <section
      id="home"
      className="flex min-h-[85vh] flex-col justify-center bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.6)_55%,rgba(0,0,0,0.15)_100%),url('/images/rainbow-roll-uramaki.webp')] bg-cover bg-center bg-no-repeat text-white sm:min-h-[calc(100vh-62px)]"
    >
      <div className="mx-auto w-full max-w-[1100px] px-6 py-12 sm:py-16">
        <p className="mb-4 text-xs tracking-[0.15em] text-[#b9b2a8] uppercase sm:text-[0.8rem]">
          Freshly Caught Fish · Dine only in Portland
        </p>
        <h1 className="max-w-3xl text-[clamp(2.75rem,7vw,5.5rem)] leading-[1.05] font-bold">
          Sushi worth <span className="italic">fishing for.</span>
        </h1>
        <p className="mt-5 max-w-lg text-base text-white/80 sm:text-xl">
          Freshly Caught Fish for you to enjoy.
        </p>
        <a
          href="#reservation"
          className="mt-8 inline-block rounded-full bg-white px-7 py-3.5 font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-line"
        >
          Reserve a spot
        </a>
      </div>
    </section>
  )
}
