import React from "react";
import BottomHeader from "./bottom-header";
import { ShowWhenScroll } from "./show-when-scroll";

const Header = async () => {
  return (
    <header className="">
      <ShowWhenScroll />
      <BottomHeader />
    </header>
  );
};

export default Header;
