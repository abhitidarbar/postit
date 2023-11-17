import Sidebar from "../components/sidebar";
import Header from "../components/header";
import Content from "../components/content";
import Trending from "../components/trending";

export default function Home() {
  return (
    <div className="flex w-screen bg-black">
      <div className="w-1/4 p-4">
        <Sidebar />
      </div>
      <hr className="h-screen border-l border-gray-200 opacity-25 sticky"></hr>
      <div className="w-1/2 py-4">
        <Header />
        <Content />
      </div>
      <hr className="h-screen border-l border-gray-200 opacity-25 sticky"></hr>
      <div className="w-1/4 p-4">
        <Trending />
      </div>
    </div>
  );
}
