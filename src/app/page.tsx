import Sidebar from "../components/sidebar";
import Header from "../components/header";
import Content from "../content";

export default function Home() {
  return (
    <div className="flex h-screen w-screen bg-black p-4">
      <Sidebar />
      <div className="ml-4">
        <Header />
        <Content />
      </div>
    </div>
  );
}
