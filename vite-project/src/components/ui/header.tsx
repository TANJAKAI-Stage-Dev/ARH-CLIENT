import { useState } from "react"
import { Bell, Menu, User } from "lucide-react"

export function Header() {
  const navList = [
    'Employees',
    'Conger',
    'Work Hours',
    'Presences',
    'Social'
  ]
  const [indexLink, setIndexLink] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 left-0 z-50 w-full bg-white shadow-md">
      <div className="px-4 mx-auto">
        <div className="flex items-center justify-between py-2">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img 
              src="/images/LOGO.svg" 
              alt="Company Logo" 
              className="w-auto h-10"
            />
          </div>

          {/* Desktop Navigation */}
          {/* <NavBar
            dataNav={navList}
            indexLink={indexLink}
            setIndexLink={setIndexLink}
            className="hidden lg:flex"
          /> */}

          {/* User and Notification Area */}
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <button className="relative p-2 transition-colors rounded-full hover:bg-gray-100">
              {/* <Bell className="text-gray-600" size={24} /> */}
              {/* <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span> */}
            </button>

            {/* User Profile */}
            <UserProfile />

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 bg-white shadow-lg lg:hidden top-full">
            <NavBar
              dataNav={navList}
              indexLink={indexLink}
              setIndexLink={setIndexLink}
              className="flex flex-col p-4"
              isMobile={true}
            />
          </div>
        )}
      </div>
    </header>
  )
}

function UserProfile() {
  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <img 
          className="object-cover w-10 h-10 rounded-full" 
          src="/images/user.png" 
          alt="User profile" 
        />
        <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
      </div>
      <div className="hidden md:block">
        <p className="text-sm font-semibold">TOLOTRA</p>
        <p className="text-xs text-gray-500">HR Department</p>
      </div>
    </div>
  )
}

interface NavBarProps {
  dataNav: string[];
  indexLink: number;
  setIndexLink: (index: number) => void;
  className?: string;
  isMobile?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({
  dataNav,
  indexLink,
  setIndexLink,
  className = "",
  isMobile = false,
}) => {
  return (
    <ul className={`${className} ${isMobile ? 'space-y-4' : 'space-x-7'} items-center`}>
      {dataNav.map((elem, index) => (
        <li
          key={elem}
          className={`
            ${indexLink === index
              ? "font-semibold text-blue-600 border-b-2 border-blue-600"
              : "font-normal text-gray-600 hover:text-blue-500"}
            transition-all duration-300 ease-in-out
            ${isMobile ? 'w-full' : ''}
          `}
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIndexLink(index);
            }}
            className={`
              block px-2 py-2
              ${isMobile ? 'text-left' : 'text-center'}
            `}
          >
            {elem}
          </a>
        </li>
      ))}
    </ul>
  );
};
export default Header
