import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-16">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Create & Share Polls Effortlessly
        </h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          Welcome to <strong>PollarBear</strong>, the simplest way to create
          engaging polls and collect real-time feedback. Whether you want to
          gather opinions, run a quick survey, or make decisions with your team,
          our platform makes it seamless and intuitive. No complex setups—just
          create, share, and analyze results instantly.
          <br />
          <br />
          PollarBear is designed for everyone—businesses, educators, content
          creators, and communities. With our easy-to-use interface, you can
          customize your polls, add multiple-choice questions, and even schedule
          them for later. Get insights, visualize responses, and make
          data-driven decisions effortlessly.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/polls">
            <Button className="px-6 py-3 text-lg transition-transform duration-200 hover:scale-105">
              View Polls
            </Button>
          </Link>
          <Link href="/create">
            <Button className="px-6 py-3 text-lg bg-blue-600 text-white hover:bg-blue-700 transition-transform duration-200 hover:scale-105">
              Create Poll
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
