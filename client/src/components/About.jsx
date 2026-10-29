const paragraphClass = 'mb-4 text-[1.05rem] leading-[1.7] text-ink-soft'

export default function About() {
  return (
    <section id="about" className="overflow-hidden border-t border-line bg-linear-to-b from-white to-surface-2">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div className="relative pr-8 pb-8 sm:pr-12 sm:pb-12 group">
          <img
            src="/images/rainbow-roll-uramaki.webp"
            alt="Rainbow roll on a plate"
            className="aspect-[4/3] w-full rounded-[1.25rem] object-cover shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
          />
          <img
            src="/images/crispy-volcano-roll.webp"
            alt="Crispy volcano roll"
            className="absolute right-0 bottom-0 aspect-[4/3] w-1/2 rotate-4 rounded-[1.25rem] border-[6px] border-white object-cover shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover:scale-[1.04] group-hover:rotate-0"
          />
        </div>

        <div>
          <p className="mb-4 text-[0.8rem] tracking-[0.15em] text-clay uppercase">Our Story</p>
          <h2 className="mb-5 text-3xl font-bold sm:text-4xl">About <span>Qitchen</span></h2>
          <p className={`${paragraphClass} first-letter:float-left first-letter:mt-1 first-letter:mr-2 first-letter:text-[3.2rem] first-letter:leading-[0.9] first-letter:font-bold first-letter:text-ink`}>
            We started Qitchen because we were tired of choosing between fresh, delicious sushi and knowing where our fish came from. Every fish we serve is carefully selected for its freshness, quality, and origin — because great sushi starts with great ingredients.
          </p>
          <p className={paragraphClass}>
            We also focus on every detail that makes a meal special: expertly prepared sushi, perfectly seasoned rice, and thoughtfully paired ingredients, all crafted with care rather than shortcuts.
          </p>
          <a
            href="#menu"
            className="mt-8 inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#333333]"
          >
            See the menu
          </a>
        </div>
      </div>
    </section>
  )
}
