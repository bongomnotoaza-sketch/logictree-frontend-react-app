import ModuleCard from './module-cards';
import { defaultModules } from './module-card-data';

function ModuleList() {
  return (
    <div className="w-full h-full flex flex-wrap justify-center content-center md:justify-start md:content-start gap-6 p-6 overflow-scroll">
      {defaultModules.map((course, index) => (
        <ModuleCard
          key={index}
          imageUrl={course.imageUrl}
          borderColor={course.borderColor}
          moduleName={course.moduleName}
          
        />
      ))}
    </div>
  );
}

export default ModuleList;