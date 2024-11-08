import logo from "@/public/Exportlogo2.png";
import AuthService from "@/services/AuthService";
import { sessionStorageService } from "@/services/sessionStorageService";
import { gsap } from "gsap";
import { Squeeze as Hamburger } from "hamburger-react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "@/components/auth/AuthContext";
import Language from "./Language";
import LanguageMobile from "./LanguageMobile";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<String | null>(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);
  const { isLoggedIn, setIsLoggedIn, userRole, setUserRole } =
    useContext(AuthContext);
  const navBackGround = useRef(null);
  const [navOpen, setNavOpen] = useState(false);
  const tl = useRef<gsap.core.Timeline>(); // Specify type for tl ref

  useEffect(() => {
    tl.current = gsap.timeline({
      paused: true,
    });

    tl.current?.to(
      navBackGround.current,
      {
        duration: 0.5,
        opacity: 1,
        ease: "power3.inOut",
      },
      0
    ),
      tl.current?.to(
        navBackGround.current,
        {
          duration: 0,
          x: "0%",
          ease: "power3.inOut",
        },
        0
      );
  }, []);

  useEffect(() => {
    navOpen ? tl.current?.play() : tl.current?.reverse();
  }, [navOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      if (e.matches) {
        setOpen(false);
        setNavOpen(false);
      }
    };

    mediaQuery.addListener(handleMediaQueryChange);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  const [isOpen, setOpen] = useState(false);

  const toggleNav = () => {
    setOpen(!isOpen);
    setNavOpen(!navOpen);
  };

  useEffect(() => {
    const userDataString = sessionStorageService.isLoggedIn();
    setIsLoggedIn(userDataString as boolean);
    if (userDataString) {
      setEmail(sessionStorageService.getItem("email") || null);
    }
  }, []);

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setUserRole("");
    try {
      const response = await AuthService.logout();

      if (response.ok) {
        sessionStorage.clear();
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getName = () => {
    const email = sessionStorageService.getItem("email");
    if (email) {
      const name = email.split("@")[0].replace(".", " ");
      return name.charAt(0).toUpperCase() + name.slice(1);
    } else {
      return "";
    }
  };

  const isAdmin = () => {
    const role = sessionStorageService.getItem("role");
    return role === "ADMIN";
  };

  return (
    <div className="flex flex-row justify-between max-w-[1140px] mx-auto px-4 text-white items-center">
      <div className="flex flex-row">
        <div className="flex flex-col items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex flex-row items-center justify-center content-center"
            >
              <Image
                src={logo}
                alt=""
                className="max-w-[100px] object-contain p-2"
                onDrop={(event) => {
                  event.preventDefault();
                  router.push('/easterEgg/plant');
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
              />
              <p className="drop-shadow-default font-semibold text-xl">
                H2Grow
              </p>
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden md:flex flex-row font-medium gap-4 items-center">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link href="/plants" className="font-medium py-4">
              {t("general.plants")}
            </Link>
            <Link href="/game" passHref locale={false} className="font-medium py-4">
              {t("general.game")}
            </Link>
            <svg
              width="12"
              height="41"
              viewBox="0 0 12 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.07812 0L6.07813 41" stroke="white" strokeWidth="3" />
            </svg>
            {sessionStorageService.isAdmin() ? (
              <div className="flex items-center gap-4">
                <p>{t("general.welcomeUser")}</p>
                <Link
                  href="/admin"
                  className="bg-purple-800 hover:bg-purple-900 text-white px-3 py-2 rounded-sm drop-shadow-default"
                >
                  {getName()}
                </Link>
              </div>
            ) : (
              <p className="capitalize">
                {t("general.welcomeUser")} {getName()}
              </p>
            )}
            <div
              onClick={handleLogout}
              className="flex items-center px-3 py-2 bg-primary-green hover:bg-secondary-green cursor-pointer transition-all text-white rounded-sm drop-shadow-default"
            >
              {t("general.logout")}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center justify-center content-center font-semibold uppercase gap-4">
            <Link
              href={"/register"}
              className="flex items-center px-3 py-2 bg-primary-grey hover:bg-secondary-grey transition-all text-white rounded-sm drop-shadow-default"
            >
              {t("general.register")}
            </Link>
            <svg
              width="12"
              height="41"
              viewBox="0 0 12 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.07812 0L6.07813 41" stroke="white" strokeWidth="3" />
            </svg>
            <Link
              href={"/login"}
              className="flex items-center px-3 py-2 bg-primary-green hover:bg-secondary-green transition-all text-white rounded-sm drop-shadow-default"
            >
              {t("general.login")}
            </Link>
          </div>
        )}
        <div className="hidden md:block">
          <Language />
        </div>
      </div>
      <div
        className={
          !navOpen
            ? "md:hidden absolute right-4 z-[111]"
            : "md:hidden fixed right-4 z-[111]"
        }
      >
        <Hamburger toggled={!isDesktop && isOpen} rounded toggle={toggleNav} />
      </div>
      <div
        className="h-[100vh] w-full bg-primary-gray fixed top-0 left-0 z-[110] justify-center opacity-0 -translate-x-full"
        ref={navBackGround}
      >
        <div className="flex items-center px-4">
          <Link
            href="/"
            onClick={toggleNav}
            className="flex flex-row items-center justify-center content-center"
          >
            <Image
              src={logo}
              alt=""
              className="max-w-[100px] object-contain p-2"
            />
            <p className="drop-shadow-default font-semibold text-xl">H2Grow</p>
          </Link>
        </div>
        <div className="flex items-center flex-col text-4xl gap-8 my-12 w-full max-w-[350px] mx-auto">
          {/* Hide these links in mobile view */}
          {isDesktop && (
            <>
              <Link href="/plants" className="font-medium py-4" onClick={toggleNav}>
                {t("general.plants")}
              </Link>
              <Link
                href="/game"
                passHref
                locale={false}
                className="font-medium"
                onClick={toggleNav}
              >
                {t("general.game")}
              </Link>
            </>
          )}

          {!isLoggedIn ? (
            <div className="gap-8 mt-8 flex flex-col">
              <Link
                href={"/register"}
                onClick={toggleNav}
                className="flex items-center justify-center content-center px-3 py-2 bg-primary-grey hover:bg-secondary-grey transition-all text-white rounded-sm drop-shadow-default"
              >
                {t("general.register")}
              </Link>
              <Link
                href={"/login"}
                onClick={toggleNav}
                className="flex items-center justify-center px-3 py-2 bg-primary-green hover:bg-secondary-green transition-all text-white rounded-sm drop-shadow-default"
              >
                {t("general.login")}
              </Link>
            </div>
          ) : (
            <div className="gap-8 mt-8 flex flex-col">
              {isAdmin() ? (
                <div className="flex items-center gap-4">
                  <p>{t("general.welcomeUser")}</p>
                  <Link
                    href="/admin"
                    className="bg-purple-800 hover:bg-purple-900 text-white px-3 py-2 rounded-sm drop-shadow-default"
                  >
                    {getName()}
                  </Link>
                </div>
              ) : (
                <p className="capitalize">
                  {t("general.welcomeUser")} {getName()}
                </p>
              )}
              <div
                onClick={handleLogout}
                className="flex items-center justify-center px-3 py-2 bg-primary-green hover:bg-secondary-green transition-all text-white rounded-sm drop-shadow-default"
              >
                {t("general.logout")}
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-4 left-4 drop-shadow-default">
          <LanguageMobile />
        </div>
      </div>
    </div>
  );
};

export default Navbar;