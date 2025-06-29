import Timer from "../components/Timer";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Timer />
    </div>
  );
}
export const metadata = {
  title: "Timer App",
  description: "A simple timer application built with Next.js",
};