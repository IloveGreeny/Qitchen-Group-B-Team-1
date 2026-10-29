export default function About() {
  return (
    <section id="about" className="about">
      <div className="about-inner">
        <div className="about-media">
          <img src="/images/rainbow-roll-uramaki.webp" alt="Rainbow roll on a plate" />
          <img src="/images/crispy-volcano-roll.webp" alt="Crispy volcano roll" />
        </div>

        <div className="about-text">
          <p className="eyebrow">Our Story</p>
          <h2>About <span>Qitchen</span></h2>
          <p>We started Qitchen because we were tired of choosing between fresh, delicious sushi and knowing where our fish came from. Every fish we serve is carefully selected for its freshness, quality, and origin — because great sushi starts with great ingredients.</p>
          <p>We also focus on every detail that makes a meal special: expertly prepared sushi, perfectly seasoned rice, and thoughtfully paired ingredients, all crafted with care rather than shortcuts.</p>
          <a href="#shop" className="btn">See the menu</a>
        </div>
      </div>
    </section>
  )
}
