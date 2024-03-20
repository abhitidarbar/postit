export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <span className="absolute top-0 flex flex-row justify-center w-48">
        <div className="font-bold">POST</div>
        <div className="font-bold">.</div>
        <div className="text-sky-500 font-bold">it</div>
      </span>

      <span className="loading loading-spinner loading-md bg-sky-500"></span>
    </div>
  );
}
