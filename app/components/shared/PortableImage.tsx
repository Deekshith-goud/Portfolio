import ImageComponent from "./ImageComponent";

type imageProp = {
  value: {
    alt: string;
    caption: string;
    placement?: "center" | "left" | "right" | "full";
    sideText?: string;
  };
};

export default function SampleImageComponent({ value }: imageProp) {
  const placement = value.placement || "center";

  let figureClass = "my-8 clear-both ";
  const imageClass = "rounded-xl border dark:border-zinc-800 border-zinc-100 w-full h-auto duration-300";

  // Check if there is side text for a split vertically-centered layout
  if (value.sideText && value.sideText.trim() !== "") {
    const isLeft = placement === "left" || placement === "center";
    return (
      <div className={`flex flex-col md:flex-row items-center gap-8 my-10 clear-both ${isLeft ? "" : "md:flex-row-reverse"}`}>
        <div className="w-full md:w-1/2">
          <ImageComponent src={value} alt={value.alt} className={imageClass} />
          {value.caption && (
            <figcaption className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400 italic">
              {value.caption}
            </figcaption>
          )}
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center dark:text-zinc-400 text-zinc-600 leading-relaxed text-lg gap-y-4">
          {value.sideText.split("\n").map((para, i) => (
            para.trim() && <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    );
  }

  if (placement === "left") {
    figureClass += "md:float-left md:mr-8 md:mb-6 w-full md:max-w-[45%]";
  } else if (placement === "right") {
    figureClass += "md:float-right md:ml-8 md:mb-6 w-full md:max-w-[45%]";
  } else if (placement === "full") {
    figureClass += "w-full";
  } else {
    // center
    figureClass += "mx-auto max-w-2xl";
  }

  return (
    <figure className={figureClass}>
      <ImageComponent src={value} alt={value.alt} className={imageClass} />
      {value.caption && (
        <figcaption className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400 italic">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}
