import { ProductType } from "@/features/products/product.types";
import { cn, currencyFormatter } from "@/lib/utils";
import React from "react";
import { TopContext } from "./top-section";
import { useRouter, useSearchParams } from "next/navigation";

const getGroupedAttributes = (
  variants: Pick<ProductType, "variants">["variants"],
) => {
  const grouped: Record<string, Set<string>> = {};
  variants.forEach((variant) => {
    variant.attributes.forEach((attr) => {
      if (!grouped[attr.name]) grouped[attr.name] = new Set();
      grouped[attr.name].add(attr.value);
    });
  });
  return Object.fromEntries(
    Object.entries(grouped).map(([k, v]) => [k, [...v]]),
  );
};
// function VariantSelector({
//   variants,
// }: {
//   variants: Pick<ProductType, "variants">["variants"];
// }) {
//   const { currentImage, setCurrentImage, setCurrentVariant } =
//     React.use(TopContext);
//   const groupedAttributes = React.useMemo(
//     () => getGroupedAttributes(variants),
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [],
//   );
//   const [selectedAttrs, setSelectedAttrs] = React.useState<{
//     [key: string]: string;
//   }>(
//     variants[0]
//       ? Object.fromEntries(
//           variants[0].attributes.map((attr) => [attr.name, attr.value]),
//         )
//       : {},
//   );
//
//   const searchParams = useSearchParams();
//   console.log("search params", searchParams);
//
//   const getValidAttributes = (name: string) => {
//     const newSelectedAttrs = { ...selectedAttrs };
//     delete newSelectedAttrs[name];
//     let filteredVariants = variants;
//
//     Object.entries(newSelectedAttrs).forEach(([name, value]) => {
//       if (value) {
//         filteredVariants = filteredVariants.filter((v) =>
//           v.attributes.some(
//             (attr) => attr.name === name && attr.value === value,
//           ),
//         );
//       }
//     });
//
//     return getGroupedAttributes(filteredVariants);
//   };
//
//   const currentVariant = React.useMemo(() => {
//     const result = variants.find((v) =>
//       v.attributes.every((attr) => selectedAttrs[attr.name] === attr.value),
//     );
//     return result;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedAttrs]);
//
//   React.useEffect(() => {
//     setCurrentVariant(currentVariant);
//   }, [currentVariant, setCurrentVariant]);
//
//   const firstCurrentVariantImage = currentVariant?.images[0] ?? "";
//
//   React.useEffect(() => {
//     if (
//       currentImage !== firstCurrentVariantImage &&
//       firstCurrentVariantImage !== ""
//     ) {
//       setCurrentImage(firstCurrentVariantImage);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [firstCurrentVariantImage]);
//
//   const handleSelect = (name: string, value: string) => {
//     setSelectedAttrs((prev) => {
//       if (prev[name] === value) {
//         const newAttrs = { ...prev };
//         delete newAttrs[name];
//         return newAttrs;
//       }
//       return { ...prev, [name]: value };
//     });
//   };
//   const formatter = currencyFormatter;
//   return (
//     <div className="space-y-4">
//       <ul className="max-h-[300px] overflow-y-auto">
//         {Object.entries(groupedAttributes).map(([name, values]) => (
//           <li key={name}>
//             <p className="font-semibold mb-2 capitalize">{name}</p>
//             <div className="flex gap-2">
//               {values.map((value) => {
//                 const isDisabled =
//                   !getValidAttributes(name)[name]?.includes(value);
//                 const isSelected = selectedAttrs[name] === value;
//                 return (
//                   <button
//                     key={value}
//                     onClick={() => !isDisabled && handleSelect(name, value)}
//                     className={cn(
//                       "px-4 py-2 border cursor-pointer  capitalize",
//                       isSelected && "bg-primary/80 text-primary-foreground",
//                       isDisabled && "opacity-50 cursor-not-allowed",
//                     )}
//                     disabled={isDisabled}
//                   >
//                     {value}
//                   </button>
//                 );
//               })}
//             </div>
//           </li>
//         ))}
//       </ul>
//
//       <div className="">
//         {currentVariant ? (
//           <div className="flex gap-2 items-baseline text-xl">
//             <span>Giá: </span>
//             <span className="text-destructive text-3xl">
//               {formatter.format(currentVariant.price)}
//             </span>
//             {currentVariant.price !== currentVariant.originPrice && (
//               <span className="text-foreground/60 line-through">
//                 {formatter.format(currentVariant.originPrice)}
//               </span>
//             )}
//             <span className="mx-3 text-foreground/70 text-sm">
//               Còn:&nbsp; {currentVariant.countInStock} sản phẩm
//             </span>
//           </div>
//         ) : (
//           <p className="text-red-500 mt-4">Hãy chọn thêm</p>
//         )}
//       </div>
//     </div>
//   );
// }

function VariantSelector({
  variants,
}: {
  variants: Pick<ProductType, "variants">["variants"];
}) {
  const { currentImage, setCurrentImage, setCurrentVariant } =
    React.use(TopContext);
  const groupedAttributes = React.useMemo(
    () => getGroupedAttributes(variants),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedAttrs = React.useMemo(() => {
    const entries: [string, string][] = [];
    for (const [key, value] of searchParams.entries()) {
      entries.push([key, value]);
    }
    return Object.fromEntries(entries);
  }, [searchParams]);

  const getValidAttributes = (name: string) => {
    const newSelectedAttrs = { ...selectedAttrs };
    delete newSelectedAttrs[name];
    let filteredVariants = variants;

    Object.entries(newSelectedAttrs).forEach(([name, value]) => {
      if (value) {
        filteredVariants = filteredVariants.filter((v) =>
          v.attributes.some(
            (attr) => attr.name === name && attr.value === value,
          ),
        );
      }
    });

    return getGroupedAttributes(filteredVariants);
  };

  const currentVariant = React.useMemo(() => {
    const result = variants.find((v) =>
      v.attributes.every((attr) => selectedAttrs[attr.name] === attr.value),
    );
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttrs]);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let shouldUpdate = false;

    // Set default value nếu thiếu
    if (params.size === 0) {
      for (const [key, values] of Object.entries(groupedAttributes)) {
        if (!params.has(key) && values.length > 0) {
          params.set(key, values[0]);
          shouldUpdate = true;
        }
      }
    }

    if (shouldUpdate) {
      router.replace(`?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let shouldUpdate = false;

    // Duyệt tất cả param hiện tại
    for (const [key, value] of params.entries()) {
      const validValues = groupedAttributes[key];

      // Nếu attribute không tồn tại hoặc giá trị không hợp lệ => xoá
      if (!validValues || !validValues.includes(value)) {
        params.delete(key);
        shouldUpdate = true;
      }
    }

    const remainParams = Object.fromEntries(params.entries());

    // Nếu không có variant nào chứa toàn bộ các param hiện tại → xóa hết search param
    const isSubsetOfAnyVariant = variants.some((variant) => {
      const attrMap = Object.fromEntries(
        variant.attributes.map((attr) => [attr.name, attr.value]),
      );

      return Object.entries(remainParams).every(
        ([key, value]) => attrMap[key] === value,
      );
    });

    if (!isSubsetOfAnyVariant && params.toString() !== "") {
      params.forEach((_, key) => params.delete(key));
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      router.replace(`?${params.toString()}`, {
        scroll: false,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, groupedAttributes, router]);

  React.useEffect(() => {
    setCurrentVariant(currentVariant);
  }, [currentVariant, setCurrentVariant]);

  const firstCurrentVariantImage = currentVariant?.images[0] ?? "";

  React.useEffect(() => {
    if (
      currentImage !== firstCurrentVariantImage &&
      firstCurrentVariantImage !== ""
    ) {
      setCurrentImage(firstCurrentVariantImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstCurrentVariantImage]);

  const handleSelect = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get(name) === value) {
      params.delete(name); // bỏ chọn
    } else {
      params.set(name, value); // chọn mới
    }

    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  };
  const formatter = currencyFormatter;
  return (
    <div className="space-y-4">
      <ul className="max-h-[300px] overflow-y-auto">
        {Object.entries(groupedAttributes).map(([name, values]) => (
          <li key={name}>
            <p className="font-semibold mb-2 capitalize">{name}</p>
            <div className="flex gap-2">
              {values.map((value) => {
                const isDisabled =
                  !getValidAttributes(name)[name]?.includes(value);
                const isSelected = selectedAttrs[name] === value;
                return (
                  <button
                    key={value}
                    onClick={() => !isDisabled && handleSelect(name, value)}
                    className={cn(
                      "px-4 py-2 border cursor-pointer  capitalize",
                      isSelected && "bg-primary/80 text-primary-foreground",
                      isDisabled && "opacity-50 cursor-not-allowed",
                    )}
                    disabled={isDisabled}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>

      <div className="h-10">
        {currentVariant ? (
          <div className="flex gap-2 items-baseline text-xl">
            <span>Giá: </span>
            <span className="text-destructive text-3xl">
              {formatter.format(currentVariant.price)}
            </span>
            {currentVariant.price !== currentVariant.originPrice && (
              <span className="text-foreground/60 line-through">
                {formatter.format(currentVariant.originPrice)}
              </span>
            )}
            <span className="mx-3 text-foreground/70 text-sm">
              Còn:&nbsp; {currentVariant.countInStock} sản phẩm
            </span>
          </div>
        ) : (
          <p className="text-red-500 mt-4">Hãy chọn thêm</p>
        )}
      </div>
    </div>
  );
}

export default VariantSelector;
