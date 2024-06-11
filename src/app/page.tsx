import { ModeToggle } from "@/components/modeToggle";
import DropZone from "../components/dropzone";

export default function Home() {
  return (
    <main className="mx-8">
      <div className="flex justify-between my-10">
        <div className="text-4xl font-bold leading-none tracking-tight md:text-5xl text-blue-800">File Uploader</div>
        <ModeToggle />
      </div>


      <DropZone className="border-2 border-dashed border-blue-800 rounded-lg p-10" />
    </main>
  );
}