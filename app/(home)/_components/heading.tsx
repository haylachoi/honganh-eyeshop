export const Heading = ({ title }: { title: string }) => {
  return (
    <h1 className="mb-8 w-max py-1 block capitalize text-3xl border-b-5 border-b-primary/70 hue-rotate-20">
      {title}
    </h1>
  );
};
