import React from "react";
import BottomHeader from "./bottom-header";
import { ShowWhenScroll } from "./show-when-scroll";
import TopHeader from "./top-header";

const Header = async () => {
  return (
    <header className="">
      <ShowWhenScroll>
        <TopHeader />
      </ShowWhenScroll>
      <div className="h-[48px]" />
      <BottomHeader />
    </header>
  );
};

export default Header;
