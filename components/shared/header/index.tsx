import React from "react";
import TopHeader from "./top-header";
import BottomHeader from "./bottom-header";

const Header = async () => {
  return (
    <header className="bg-amber-300">
      <TopHeader className="" />
      <BottomHeader />
    </header>
  );
};

export default Header;
