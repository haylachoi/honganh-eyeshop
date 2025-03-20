import {
  TabList,
  TabPanel,
  Tabs,
  TabTrigger,
} from "@/components/custom-ui/tabs";
import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { Heading } from "../heading";

const Featured = ({ className }: { className?: string }) => {
  return (
    <Tabs className={cn("container", className)}>
      <div className="flex justify-between items-baseline">
        <Heading title="Featured" />
        <TabList>
          {ItemTabs.map((tab) => (
            <TabTrigger
              key={tab.value}
              value={tab.value}
              className="text-foreground/70"
              activeClassName="text-primary"
            >
              {tab.title}
            </TabTrigger>
          ))}
        </TabList>
      </div>
      {ItemTabs.map((tab) => (
        <TabPanel key={tab.value} value={tab.value}>
          <Suspense fallback={<div>Loading...</div>}>
            <tab.component />
          </Suspense>
        </TabPanel>
      ))}
    </Tabs>
  );
};

export default Featured;

const Blogs = () => {
  return <div>blog</div>;
};

const DealHots = () => {
  return <div>deal</div>;
};

const ItemTabs = [
  {
    title: "Trending",
    value: "Trending",
    component: Blogs,
  },
  {
    title: "Deal hot",
    value: "Deal hot",
    component: DealHots,
  },
];
