import { Suspense, lazy } from "react";
import { Loader, Hud } from "./hud";
import { Hero, Brief, Timeline, Work, Stack, Contact } from "./sections";
import Archive from "./archive";
import { Story, Notes } from "./story";
import Palette from "./palette";
import Compose from "./compose";
import { Cursor } from "./fx";

// three.js is the heaviest part, so it loads in its own chunk after the text is up
const World = lazy(() => import("./scene/World"));

export default function App() {
  return (
    <>
      <Suspense fallback={null}>
        <World />
      </Suspense>
      <div className="scrim" aria-hidden="true" />
      <main>
        <Hero />
        <Brief />
        <Timeline />
        <Work />
        <Stack />
        <Contact />
      </main>
      <Hud />
      <Archive />
      <Story />
      <Notes />
      <Palette />
      <Compose />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Loader />
    </>
  );
}
