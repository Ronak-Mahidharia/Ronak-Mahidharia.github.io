import type { CSSProperties } from "react";

// The seasonal touch behind the intro: a warm sun (Summer), falling leaves (Autumn), snowfall (Winter), and rain
// (Rain). Every layer is in the page; globals.css shows and runs only the current theme's layer, fades layers in and
// out when the theme changes, and hides them all for visitors who ask for less motion. Decorative only.

// A small fixed sequence of "random" numbers, so the layout is the same on every build and every visit.
// (Park and Miller's generator: its products stay within JavaScript's exact integers.)
function sequence(seed: number) {
  let state = seed % 2147483647;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}

type Vars = CSSProperties & Record<`--${string}`, string>;
const next = sequence(20261017);

const SNOW: Vars[] = Array.from({ length: 22 }, (_, i) => ({
  left: `${((i + next()) * (100 / 22)).toFixed(1)}%`,
  "--size": `${(3 + next() * 3.5).toFixed(1)}px`,
  "--d": `${(10 + next() * 8).toFixed(1)}s`,
  "--delay": `${(-next() * 18).toFixed(1)}s`,
  "--sway": `${((next() - 0.5) * 70).toFixed(0)}px`,
}));

const RAIN: Vars[] = Array.from({ length: 28 }, (_, i) => ({
  left: `${((i + next()) * (110 / 28)).toFixed(1)}%`,
  "--len": `${(14 + next() * 12).toFixed(0)}px`,
  "--d": `${(0.8 + next() * 0.6).toFixed(2)}s`,
  "--delay": `${(-next() * 1.4).toFixed(2)}s`,
}));

const LEAVES: Vars[] = Array.from({ length: 14 }, (_, i) => ({
  left: `${((i + next()) * (100 / 14)).toFixed(1)}%`,
  "--size": `${(12 + next() * 8).toFixed(0)}px`,
  "--d": `${(11 + next() * 7).toFixed(1)}s`,
  "--delay": `${(-next() * 18).toFixed(1)}s`,
  "--sway": `${(18 + next() * 30).toFixed(0)}px`,
  "--spin": `${(next() > 0.5 ? 1 : -1) * (200 + Math.round(next() * 300))}deg`,
  "--leaf": `var(--leaf-${(i % 4) + 1})`,
}));

export function SeasonEffects() {
  return (
    <div aria-hidden="true" className="season-fx">
      <div className="fx-layer fx-sun">
        <span />
      </div>
      <div className="fx-layer fx-leaves">
        {LEAVES.map((style, i) => (
          <span key={i} style={style} />
        ))}
      </div>
      <div className="fx-layer fx-snow">
        {SNOW.map((style, i) => (
          <span key={i} style={style} />
        ))}
      </div>
      <div className="fx-layer fx-rain">
        {RAIN.map((style, i) => (
          <span key={i} style={style} />
        ))}
      </div>
    </div>
  );
}
