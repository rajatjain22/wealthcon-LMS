"use client";

import Search from "../Search/Search";
import Profile from "../Dropdown/Profile";
import ProfileImage from "../../assets/images/profile.png";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../assets/images/svg/logo.svg";
import HamburgerIcon from "../../assets/images/svg/hamburgerIcon.svg";
import Notification from "../../assets/images/svg/notification.svg";
import SearchIcon from "../../assets/images/svg/search.svg";
import { Fragment, useState } from "react";
import Button from "../Button";
import { useRouter } from "next/navigation";
//import './header.scss'; // Assuming there's a corresponding SCSS file for styles

const Header = () => {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(true);

  const toggleSearch = () => {
    setShowSearch(!showSearch); // Toggle showSearch state
  };

  const handleLogout = () => {
    fetch("/api/auth/logout")
      .then((res) => res.json())
      .then((res) => {
        if (res?.message) {
          router.push("/login");
        } else {
          throw new Error("Logout Failed");
        }
      })
      .catch((error) => {
        console.log("logout failed", error.message);
      });
  };

  return (
    <Fragment>
      <div className="navbar lg:hidden px-5 py-0">
        <div className="navbar-start">
          <Link href="/">
            <Image src={Logo} alt="logo" className="text-center w-10" />
          </Link>
        </div>
        <div className="navbar-end gap-4">
          <Profile profileImage={ProfileImage} />

          <Image
            src={SearchIcon}
            alt="search"
            className="cursor-pointer"
            onClick={toggleSearch}
          />

          <div className="dropdown">
            <label htmlFor="my-drawer" className="p-4 drawer-button">
              <Image src={HamburgerIcon} alt="icon" />
            </label>
          </div>
        </div>
      </div>
      {!showSearch && (
        <div className="lg:hidden block bg-gray85 px-5 py-2 shadow">
          <Search />
        </div>
      )}

      <div className="hidden lg:flex flex-wrap justify-between items-center p-4 shadow-sm bg-primary-content sticky top-0">
        <div className="flex place-items-center gap-3">
          <div className="dropdown">
            <label htmlFor="my-drawer" className="drawer-button cursor-pointer">
              <Image src={HamburgerIcon} alt="icon" />
            </label>
          </div>
          <Search />
        </div>
        <div className="flex place-items-center gap-3">
          <div className="notifications cursor-pointer">
            <Image src={Notification} alt="icon" />
          </div>
          <Button
            onClick={handleLogout}
            href="#"
            className="btn-sm bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          >
            Logout
          </Button>

          <Profile title="Dr. Jhon" profileImage={ProfileImage} />
        </div>
      </div>
    </Fragment>
  );
};

export default Header;
