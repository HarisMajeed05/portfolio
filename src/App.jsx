import World from "./scene/World";
import { Loader, Hud } from "./hud";
import { Hero, Brief, Timeline, Work, Stack, Contact } from "./sections";
import Archive from "./archive";
import { Story, Notes } from "./story";
import Palette from "./palette";
import Compose from "./compose";
import { Cursor } from "./fx";

export default function App() {
  return (
    <>
      <World />
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
