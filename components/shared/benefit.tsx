import { getSettings } from "@/features/settings/settings.queries";
import { getBenefitInfos } from "@/features/others/other.services";

export const Benefit = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <BenefitProvider />
    </div>
  );
};

const BenefitProvider = async () => {
  const result = await getSettings();
  const benefits = result.success ? result.data.banners?.benefits : null;

  if (!benefits || !benefits.isActive) {
    const benefitInfos = await getBenefitInfos();
    return (
      <ul className="container py-6 grid grid-cols-[repeat(auto-fit,minmax(min(330px,100%),1fr))] gap-4">
        {benefitInfos.map((benefitInfo) => (
          <li
            key={benefitInfo.title}
            className="w-full lg:w-auto flex gap-4 items-center lg:justify-center flex-grow lg:not-last:border-r border-foreground/40"
          >
            <benefitInfo.Icon
              className="size-10 text-primary "
              strokeWidth={1}
            />

            <div>
              <p className="font-semibold">{benefitInfo.title}</p>
              <p className="text-foreground/70">{benefitInfo.subTitle}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  }
};
