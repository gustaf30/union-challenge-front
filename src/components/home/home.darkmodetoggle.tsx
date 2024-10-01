import { Button } from "../ui/button";

export const DarkModeToggle = ({ darkMode, setDarkMode }: any) => {
    const toggleDarkMode = () => {
      const newDarkMode = !darkMode;
      setDarkMode(newDarkMode);
      document.body.classList.toggle('dark', newDarkMode);
      localStorage.setItem('darkMode', newDarkMode.toString());
    };
  
    return (
      <Button onClick={toggleDarkMode} className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </Button>
    );
  };
  