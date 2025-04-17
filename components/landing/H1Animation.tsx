import { cn } from "@/lib/utils";

const H1Animation = () => {
  const tags = ["BrutalyHonest is", "about", "Leisure"];

  return (
    <div>
      <h1 className="sr-only">BrutalyHonest is about Leisure</h1>

      {tags.map((tag, index) => (
        <h1
          className="text-6xl md:text-8xl font-black overflow-hidden not-sr-only"
          key={index}
        >
          <span
            className={cn(
              "inline-flex",
              index === tags.length - 1 && "text-primary"
            )}
          >
            {tag}
          </span>
        </h1>
      ))}
    </div>
  );
};

export default H1Animation;
