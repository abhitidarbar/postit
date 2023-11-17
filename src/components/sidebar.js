export default function Sidebar() {
  return (
    <div className="flex flex-col sticky top-0">
      <span className="flex flex-row justify-center mb-4 w-48">
        <div className="font-bold">POST</div>
        <div className="font-bold">.</div>
        <div className="text-sky-500 font-bold">it</div>
      </span>
      <button
        type="button"
        class="text-white hover:bg-gray-800 font-bold rounded-full text-lg px-10 py-2.5 text-center mb-2 w-48"
      >
        Home
      </button>
      <button
        type="button"
        class="text-white hover:bg-gray-800 font-bold rounded-full text-lg px-10 py-2.5 text-center mb-2 w-48"
      >
        Profile
      </button>
      <button
        type="button"
        class="text-white bg-sky-500 hover:bg-sky-600 font-bold rounded-full text-md px-6 py-2.5 text-center mb-2 w-48"
      >
        Post
      </button>
    </div>
  );
}
