type ModuleCardProps = {
  imageUrl: string;
  borderColor: string;
  moduleName: string;
};

export default function ModuleCard({
  imageUrl,
  borderColor,
  moduleName,
  
}: ModuleCardProps) {
  return (
    <div
       className="w-[150px] h-[250px] sm:w-[180px] sm:h-[300px] grid grid-rows-[50%_50%] overflow-hidden rounded-t-xl bg-zinc-800 transition-all duration-200 ease-out hover:translate-x-1 hover:-translate-y-1"
      style={{ borderBottom: `2px solid ${borderColor}` }}
    >
      <div className="relative">
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="h-full w-full flex flex-col justify-center px-4">
        <h1 className="font-bold text-white">
          {moduleName}
        </h1>
      </div>
    </div>
  );
}