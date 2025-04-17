// "use client";
// import { useContext, useEffect, useRef } from "react";
// import { useSearchParams } from "next/navigation";
// import axios from "axios";
// import useSWR from "swr";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// import CategoryBox from "@/components/categories/CategoryBox";
// import { Category } from "@prisma/client";
// import { getCategories } from "@/util/routes";
// import { getCategoryIcon } from "@/util/getCategoryIcon";
// import { AppContext, HomeView } from "@/util/AppContext";
// import { cn } from "@/lib/utils";

// const Categories = () => {
//   const categoryRef = useRef<HTMLDivElement>(null);
//   const searchParams = useSearchParams();

//   const { data } = useContext(AppContext);

//   const fetcher = (url: string) =>
//     axios.get(url).then((res) => res.data.categories);

//   const { data: categories = [] as Category[] } = useSWR(
//     getCategories("home"),
//     fetcher
//   );

//   const category = searchParams.get("category");

//   useEffect(() => {
//     window.addEventListener("scroll", onscrollStart);

//     return () => window.removeEventListener("scroll", onscrollEnd);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const onscrollStart = async () => {
//     if (categoryRef.current?.classList.contains("shadow-sm"))
//       return removeShadow();

//     if (window.scrollY > 30) categoryRef.current?.classList.add("shadow-sm");
//   };

//   const removeShadow = async () => {
//     if (window.scrollY < 30) onscrollEnd();

//     return;
//   };

//   const onscrollEnd = async () => {
//     categoryRef.current?.classList.remove("shadow-sm");
//   };

//   return (
//     <></>
//     // <div
//     //   ref={categoryRef}
//     //   className={cn(
//     //     "sticky pt-1 md:pt-2 overflow-x-auto bg-background transition z-10",
//     //     data.view === HomeView.Stays && "top-[80px]",
//     //     data.view === HomeView.Tours && "hidden"
//     //   )}
//     // >
//     //   <ScrollArea className="container whitespace-nowrap">
//     //     <div className="flex w-max items-center space-x-4">
//     //       {categories.map((item: Category) => (
//     //         <CategoryBox
//     //           key={item.label}
//     //           label={item.label}
//     //           icon={getCategoryIcon(item.icon)}
//     //           id={item.label.toLowerCase()}
//     //           selected={category === item.label.toLowerCase()}
//     //         />
//     //       ))}
//     //     </div>
//     //     <ScrollBar orientation="horizontal" />
//     //   </ScrollArea>
//     // </div>
//   );
// };

// export default Categories;
