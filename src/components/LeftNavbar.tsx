import { Videotape, House } from "lucide-react";
const LeftNavbar = () => {
  const navbarItems = [
    {
      name: "Now Playing",
      icon: <House size={20} color="white" />,
    },
    {
      name: "Beats",
      icons: "note",
    },
    {
      name: "Playlists",
      icons: "list",
    },
    {
      name: "Favorites",
      icon: "Heart",
    },
    {
      name: "History",
      icon: "Clock",
    },
  ];
  return (
    <aside className="left-navbar-container h-screen mr-auto">
      <nav className="w-40 shrink-0 h-2/5 ml-8 mr-8">
        <div className="flex items-center p-4 gap-x-4">
          <Videotape size={50} color="pink" />
          <div>
            <h1 className="lofi-text text-md tracking-widest font-bold">
              LOFI
            </h1>
            <h1 className="lofi-text text-md tracking-widest font-bold">
              PLAYER
            </h1>
          </div>
        </div>
        {navbarItems.map((item, index) => (
          <div
            className="left-navbar-item-text-color flex items-center gap-x-4 p-4 hover:bg-gray-700 rounded-lg cursor-pointer"
            key={index}
          >
            {item.icon}
            {item.name}
          </div>
        ))}
      </nav>
      <nav className="w-40 shrink-0 h-3/5">Hello</nav>
    </aside>
  );
};

export default LeftNavbar;
